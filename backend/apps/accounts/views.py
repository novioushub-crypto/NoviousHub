from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from .models import CustomUser, Address, OTP
from .serializers import (
    UserSerializer, RegisterSerializer, AddressSerializer, ChangePasswordSerializer
)
from apps.core.email_service import EmailService


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    
    @method_decorator(ratelimit(key='ip', rate='5/h', method='POST'))
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate and send OTP
        otp_code = OTP.generate_otp(user.email)
        EmailService.send_otp_email(
            email=user.email,
            otp_code=otp_code,
            first_name=user.first_name
        )
        
        return Response({
            'message': 'Registration successful. Please check your email for OTP verification.',
            'email': user.email,
            'requires_verification': True
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='10/h', method='POST')
def verify_otp(request):
    """
    Verify OTP code sent to user's email
    Expects: { "email": "user@example.com", "code": "123456" }
    Returns: { "access": "jwt_token", "refresh": "jwt_token", "user": {...} }
    """
    email = request.data.get('email')
    code = request.data.get('code')
    
    if not email or not code:
        return Response(
            {'error': 'Email and code are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verify OTP
    if OTP.verify_otp(email, code):
        try:
            user = CustomUser.objects.get(email=email)
            user.is_verified = True
            user.save()
            
            # Send welcome email
            EmailService.send_welcome_email(
                email=user.email,
                first_name=user.first_name
            )
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            user_serializer = UserSerializer(user)
            
            return Response({
                'message': 'Email verified successfully',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': user_serializer.data
            }, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    else:
        return Response(
            {'error': 'Invalid or expired OTP code'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='5/h', method='POST')
def resend_otp(request):
    """
    Resend OTP code to user's email
    Expects: { "email": "user@example.com" }
    """
    email = request.data.get('email')
    
    if not email:
        return Response(
            {'error': 'Email is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = CustomUser.objects.get(email=email)
        
        # Generate and send new OTP
        otp_code = OTP.generate_otp(user.email)
        EmailService.send_otp_email(
            email=user.email,
            otp_code=otp_code,
            first_name=user.first_name
        )
        
        return Response({
            'message': 'OTP resent successfully. Please check your email.'
        }, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    """
    Handle Google OAuth login
    Expects: { "credential": "google_id_token" }
    Returns: { "access": "jwt_token", "refresh": "jwt_token", "user": {...} }
    """
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        token = request.data.get('credential')
        
        logger.info(f"Google login attempt - Token received: {bool(token)}")
        logger.info(f"Request data keys: {request.data.keys()}")
        
        if not token:
            logger.error("No credential provided in request")
            return Response(
                {'error': 'No credential provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        logger.info(f"Attempting to verify token with Google...")
        logger.info(f"Client ID: {settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY}")
        
        # Verify the Google token
        # The client ID should match the one used in the frontend
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY
        )
        
        logger.info(f"Token verified successfully. Email: {idinfo.get('email')}")
        
        # Get user info from Google
        email = idinfo.get('email')
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')
        google_id = idinfo.get('sub')
        
        if not email:
            logger.error("Email not provided by Google")
            return Response(
                {'error': 'Email not provided by Google'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        logger.info(f"Creating/retrieving user for email: {email}")
        
        # Get or create user
        user, created = CustomUser.objects.get_or_create(
            email=email,
            defaults={
                'first_name': first_name,
                'last_name': last_name,
                'is_active': True,
            }
        )
        
        logger.info(f"User {'created' if created else 'retrieved'}: {user.email}")
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        # Serialize user data
        user_serializer = UserSerializer(user)
        
        # Send welcome email for first-time login
        if created:
            EmailService.send_welcome_email(
                email=user.email,
                first_name=user.first_name
            )
        
        logger.info(f"Login successful for user: {user.email}")
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)
        
    except ValueError as e:
        # Invalid token
        logger.error(f"Invalid Google token: {str(e)}")
        return Response(
            {'error': 'Invalid Google token', 'detail': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Unexpected error in google_login: {str(e)}", exc_info=True)
        return Response(
            {'error': 'Internal server error', 'detail': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Admin can see all users, regular users can only see themselves
        if self.request.user.is_staff:
            return CustomUser.objects.all().order_by('-date_joined')
        return CustomUser.objects.filter(id=self.request.user.id)
    
    def list(self, request, *args, **kwargs):
        # Only allow admins to list all users
        if not request.user.is_staff:
            return Response(
                {'error': 'You do not have permission to view all users'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().list(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            if not request.user.check_password(serializer.validated_data['old_password']):
                return Response({'error': 'Wrong password'}, status=status.HTTP_400_BAD_REQUEST)
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({'message': 'Password updated successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
    ordering = ['-created_at']  # Required for CursorPagination
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
