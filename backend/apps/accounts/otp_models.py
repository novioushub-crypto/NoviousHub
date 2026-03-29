"""
OTP (One-Time Password) models for email verification
"""
from django.db import models
from django.utils import timezone
from datetime import timedelta
import random
import string


class OTP(models.Model):
    """Model to store OTP codes for email verification"""
    
    email = models.EmailField()
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'otp_codes'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email', 'code']),
            models.Index(fields=['expires_at']),
        ]
    
    def __str__(self):
        return f"OTP for {self.email} - {self.code}"
    
    @classmethod
    def generate_otp(cls, email: str) -> str:
        """
        Generate a new 6-digit OTP code for the given email
        
        Args:
            email: User's email address
            
        Returns:
            str: 6-digit OTP code
        """
        # Generate random 6-digit code
        code = ''.join(random.choices(string.digits, k=6))
        
        # Set expiration time (10 minutes from now)
        expires_at = timezone.now() + timedelta(minutes=10)
        
        # Invalidate any existing unused OTPs for this email
        cls.objects.filter(email=email, is_used=False).update(is_used=True)
        
        # Create new OTP
        otp = cls.objects.create(
            email=email,
            code=code,
            expires_at=expires_at
        )
        
        return code
    
    @classmethod
    def verify_otp(cls, email: str, code: str) -> bool:
        """
        Verify if the OTP code is valid for the given email
        
        Args:
            email: User's email address
            code: OTP code to verify
            
        Returns:
            bool: True if OTP is valid, False otherwise
        """
        try:
            otp = cls.objects.get(
                email=email,
                code=code,
                is_used=False,
                expires_at__gt=timezone.now()
            )
            # Mark as used
            otp.is_used = True
            otp.save()
            return True
        except cls.DoesNotExist:
            return False
    
    @classmethod
    def cleanup_expired(cls):
        """Delete expired OTP codes (older than 24 hours)"""
        cutoff_time = timezone.now() - timedelta(hours=24)
        cls.objects.filter(created_at__lt=cutoff_time).delete()
