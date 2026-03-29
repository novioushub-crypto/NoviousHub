"""
Email service using Resend API
"""
import resend
from django.conf import settings
from django.template.loader import render_to_string
import logging

logger = logging.getLogger(__name__)

# Configure Resend API key
resend.api_key = settings.RESEND_API_KEY


class EmailService:
    """Service for sending emails using Resend"""
    
    @staticmethod
    def send_otp_email(email: str, otp_code: str, first_name: str = "") -> bool:
        """
        Send OTP verification email to user
        
        Args:
            email: User's email address
            otp_code: 6-digit OTP code
            first_name: User's first name
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify Your Email - Noviious</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #8B5CF6 0%, #D97706 100%); padding: 40px 30px; text-align: center;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 1px;">NOVIIOUS</h1>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
                                            {"Hi " + first_name + "!" if first_name else "Welcome!"}
                                        </h2>
                                        <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                            Thank you for registering with Noviious! To complete your registration and verify your email address, please use the following One-Time Password (OTP):
                                        </p>
                                        
                                        <!-- OTP Box -->
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                            <tr>
                                                <td align="center">
                                                    <div style="background: linear-gradient(135deg, #8B5CF6 0%, #D97706 100%); border-radius: 8px; padding: 20px; display: inline-block;">
                                                        <span style="color: #ffffff; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                                            {otp_code}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <p style="margin: 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                            This OTP will expire in <strong>10 minutes</strong>. Please do not share this code with anyone.
                                        </p>
                                        
                                        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                            <p style="margin: 0; color: #92400e; font-size: 14px;">
                                                <strong>Security Tip:</strong> If you didn't request this verification code, please ignore this email or contact our support team.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                                            Need help? Contact us at <a href="mailto:support@noviious.com" style="color: #8B5CF6; text-decoration: none;">support@noviious.com</a>
                                        </p>
                                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                            © 2024 Noviious. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """
            
            params = {
                "from": settings.RESEND_FROM_EMAIL,
                "to": [email],
                "subject": "Verify Your Email - Noviious",
                "html": html_content,
            }
            
            response = resend.Emails.send(params)
            logger.info(f"OTP email sent successfully to {email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send OTP email to {email}: {str(e)}")
            return False
    
    @staticmethod
    def send_welcome_email(email: str, first_name: str = "") -> bool:
        """
        Send welcome email after successful login
        
        Args:
            email: User's email address
            first_name: User's first name
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Noviious</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #8B5CF6 0%, #D97706 100%); padding: 50px 30px; text-align: center;">
                                        <h1 style="margin: 0 0 10px 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 1px;">NOVIIOUS</h1>
                                        <p style="margin: 0; color: #ffffff; font-size: 18px; opacity: 0.9;">Premium Fashion & Sportswear</p>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 28px; font-weight: 600; text-align: center;">
                                            Welcome{"" if not first_name else " " + first_name}! 🎉
                                        </h2>
                                        <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center;">
                                            We're thrilled to have you join the Noviious family! Get ready to explore our premium collection of leather jackets and high-performance sportswear.
                                        </p>
                                        
                                        <!-- Features -->
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                            <tr>
                                                <td style="padding: 20px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 15px;">
                                                    <h3 style="margin: 0 0 10px 0; color: #8B5CF6; font-size: 18px; font-weight: 600;">🛍️ Exclusive Collections</h3>
                                                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                                                        Browse our curated selection of premium leather jackets and athletic wear designed for style and performance.
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 20px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 15px;">
                                                    <h3 style="margin: 0 0 10px 0; color: #D97706; font-size: 18px; font-weight: 600;">🚚 Fast Shipping</h3>
                                                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                                                        Enjoy quick and reliable delivery on all orders. Track your package every step of the way.
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 20px; background-color: #f9fafb; border-radius: 8px;">
                                                    <h3 style="margin: 0 0 10px 0; color: #8B5CF6; font-size: 18px; font-weight: 600;">💎 Member Benefits</h3>
                                                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                                                        Get access to exclusive deals, early product launches, and special member-only promotions.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- CTA Button -->
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                            <tr>
                                                <td align="center">
                                                    <a href="https://www.noviious.com/products" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #D97706 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);">
                                                        Start Shopping
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                                            Have questions? Our support team is here to help you 24/7.
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                                            Follow us on social media for the latest updates and exclusive offers!
                                        </p>
                                        <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">
                                            Need help? Contact us at <a href="mailto:support@noviious.com" style="color: #8B5CF6; text-decoration: none;">support@noviious.com</a>
                                        </p>
                                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                            © 2024 Noviious. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """
            
            params = {
                "from": settings.RESEND_FROM_EMAIL,
                "to": [email],
                "subject": "Welcome to Noviious - Let's Get Started! 🎉",
                "html": html_content,
            }
            
            response = resend.Emails.send(params)
            logger.info(f"Welcome email sent successfully to {email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send welcome email to {email}: {str(e)}")
            return False
    
    @staticmethod
    def send_order_confirmation_email(email: str, order_data: dict) -> bool:
        """
        Send order confirmation email after checkout
        
        Args:
            email: User's email address
            order_data: Dictionary containing order details
                - order_number: str
                - first_name: str
                - total_amount: float
                - items: list of dicts with name, quantity, price
                - shipping_address: dict
                
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            # Build items HTML
            items_html = ""
            for item in order_data.get('items', []):
                items_html += f"""
                <tr>
                    <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #1f2937; font-size: 14px; font-weight: 600;">{item.get('name', 'Product')}</p>
                        <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px;">Quantity: {item.get('quantity', 1)}</p>
                    </td>
                    <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                        <p style="margin: 0; color: #1f2937; font-size: 14px; font-weight: 600;">${item.get('price', 0):.2f}</p>
                    </td>
                </tr>
                """
            
            shipping_address = order_data.get('shipping_address', {})
            address_html = f"""
            {shipping_address.get('full_name', '')}<br>
            {shipping_address.get('address_line1', '')}<br>
            {shipping_address.get('address_line2', '') + '<br>' if shipping_address.get('address_line2') else ''}
            {shipping_address.get('city', '')}, {shipping_address.get('state', '')} {shipping_address.get('postal_code', '')}<br>
            {shipping_address.get('country', '')}
            """
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Confirmation - Noviious</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #8B5CF6 0%, #D97706 100%); padding: 40px 30px; text-align: center;">
                                        <h1 style="margin: 0 0 10px 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 1px;">NOVIIOUS</h1>
                                        <p style="margin: 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Order Confirmation</p>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <div style="text-align: center; margin-bottom: 30px;">
                                            <div style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 10px 20px; border-radius: 50px; font-size: 14px; font-weight: 600;">
                                                ✓ Order Confirmed
                                            </div>
                                        </div>
                                        
                                        <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
                                            Thank you{"" if not order_data.get('first_name') else ", " + order_data.get('first_name')}!
                                        </h2>
                                        <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                            Your order has been confirmed and will be shipped soon. We'll send you a tracking number once your order is on its way.
                                        </p>
                                        
                                        <!-- Order Details -->
                                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="padding-bottom: 10px;">
                                                        <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Order Number</p>
                                                        <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 16px; font-weight: 600;">{order_data.get('order_number', 'N/A')}</p>
                                                    </td>
                                                    <td style="padding-bottom: 10px; text-align: right;">
                                                        <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Order Total</p>
                                                        <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 16px; font-weight: 600;">${order_data.get('total_amount', 0):.2f}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                        
                                        <!-- Order Items -->
                                        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600;">Order Items</h3>
                                        <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
                                            {items_html}
                                            <tr>
                                                <td style="padding: 15px; background-color: #f9fafb;">
                                                    <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600;">Total</p>
                                                </td>
                                                <td style="padding: 15px; background-color: #f9fafb; text-align: right;">
                                                    <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600;">${order_data.get('total_amount', 0):.2f}</p>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Shipping Address -->
                                        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600;">Shipping Address</h3>
                                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                                            <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
                                                {address_html}
                                            </p>
                                        </div>
                                        
                                        <!-- CTA Button -->
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                            <tr>
                                                <td align="center">
                                                    <a href="https://www.noviious.com/orders/{order_data.get('order_number', '')}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #D97706 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);">
                                                        Track Your Order
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                            <p style="margin: 0; color: #1e40af; font-size: 14px;">
                                                <strong>What's Next?</strong> You'll receive a shipping confirmation email with tracking information once your order ships. Estimated delivery: 3-5 business days.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                                            Questions about your order? Contact us at <a href="mailto:support@noviious.com" style="color: #8B5CF6; text-decoration: none;">support@noviious.com</a>
                                        </p>
                                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                            © 2024 Noviious. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """
            
            params = {
                "from": settings.RESEND_FROM_EMAIL,
                "to": [email],
                "subject": f"Order Confirmation #{order_data.get('order_number', 'N/A')} - Noviious",
                "html": html_content,
            }
            
            response = resend.Emails.send(params)
            logger.info(f"Order confirmation email sent successfully to {email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send order confirmation email to {email}: {str(e)}")
            return False
