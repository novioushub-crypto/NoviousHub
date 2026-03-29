from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from datetime import timedelta
import random
import string


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    avatar = models.URLField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.email
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()


class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    newsletter_subscribed = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'profiles'
    
    def __str__(self):
        return f"Profile of {self.user.email}"


class Address(models.Model):
    ADDRESS_TYPE_CHOICES = [
        ('shipping', 'Shipping'),
        ('billing', 'Billing'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='addresses')
    address_type = models.CharField(max_length=10, choices=ADDRESS_TYPE_CHOICES)
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='US')
    is_default = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'addresses'
        verbose_name_plural = 'Addresses'
        ordering = ['-is_default', '-created_at']
    
    def __str__(self):
        return f"{self.full_name} - {self.city}, {self.state}"
    
    def save(self, *args, **kwargs):
        if self.is_default:
            Address.objects.filter(
                user=self.user,
                address_type=self.address_type,
                is_default=True
            ).update(is_default=False)
        super().save(*args, **kwargs)



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
