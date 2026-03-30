import { Metadata } from 'next'
import { FileText, Scale, ShoppingBag, CreditCard, Package, AlertTriangle, Shield, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms and conditions for using Noviious services.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface dark:bg-surface-dark">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Terms of Service</h1>
          <p className="text-text-secondary text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <div className="card mb-8">
          <p className="text-lg leading-relaxed">
            Welcome to Noviious! These Terms of Service ("Terms") govern your access to and use of our website, products, and services. By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-accent" />
            Table of Contents
          </h2>
          <ol className="space-y-2 list-decimal list-inside text-accent">
            <li><a href="#acceptance" className="hover:underline">Acceptance of Terms</a></li>
            <li><a href="#account" className="hover:underline">Account Registration</a></li>
            <li><a href="#use-of-service" className="hover:underline">Use of Service</a></li>
            <li><a href="#products" className="hover:underline">Products and Pricing</a></li>
            <li><a href="#orders" className="hover:underline">Orders and Payment</a></li>
            <li><a href="#shipping" className="hover:underline">Shipping and Delivery</a></li>
            <li><a href="#returns" className="hover:underline">Returns and Refunds</a></li>
            <li><a href="#intellectual-property" className="hover:underline">Intellectual Property</a></li>
            <li><a href="#prohibited" className="hover:underline">Prohibited Activities</a></li>
            <li><a href="#limitation" className="hover:underline">Limitation of Liability</a></li>
            <li><a href="#termination" className="hover:underline">Termination</a></li>
            <li><a href="#governing-law" className="hover:underline">Governing Law</a></li>
            <li><a href="#changes" className="hover:underline">Changes to Terms</a></li>
            <li><a href="#contact" className="hover:underline">Contact Information</a></li>
          </ol>
        </div>

        {/* Section 1 */}
        <div id="acceptance" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using Noviious ("we," "us," or "our"), you accept and agree to be bound by these Terms of Service and our Privacy Policy. These Terms apply to all visitors, users, and others who access or use our services.
          </p>
          <p>
            If you are using our services on behalf of an organization, you agree to these Terms on behalf of that organization and warrant that you have the authority to bind that organization to these Terms.
          </p>
        </div>

        {/* Section 2 */}
        <div id="account" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-accent" />
            2. Account Registration
          </h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">Account Creation</h3>
          <p className="mb-4">To access certain features, you must create an account. You agree to:</p>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and update your information</li>
            <li>Keep your password secure and confidential</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Be responsible for all activities under your account</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Account Eligibility</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>You must be at least 18 years old to create an account</li>
            <li>You must provide a valid email address</li>
            <li>You must not have been previously banned from our services</li>
            <li>You must comply with all applicable laws</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div id="use-of-service" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">3. Use of Service</h2>
          <p className="mb-4">You agree to use our services only for lawful purposes. You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Violate any laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Transmit harmful or malicious code</li>
            <li>Attempt to gain unauthorized access</li>
            <li>Interfere with or disrupt our services</li>
            <li>Collect user information without consent</li>
            <li>Impersonate any person or entity</li>
            <li>Engage in fraudulent activities</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div id="products" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-accent" />
            4. Products and Pricing
          </h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">Product Information</h3>
          <p className="mb-4">
            We strive to provide accurate product descriptions, images, and pricing. However:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li>Product colors may vary due to screen settings</li>
            <li>We do not warrant that descriptions are error-free</li>
            <li>We reserve the right to correct errors or inaccuracies</li>
            <li>Product availability is subject to change</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Pricing</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>All prices are in USD unless otherwise stated</li>
            <li>Prices are subject to change without notice</li>
            <li>We reserve the right to cancel orders with pricing errors</li>
            <li>Promotional prices are valid for limited time only</li>
            <li>Taxes and shipping costs are calculated at checkout</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div id="orders" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-accent" />
            5. Orders and Payment
          </h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">Order Acceptance</h3>
          <p className="mb-4">
            Your order is an offer to purchase products. We reserve the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li>Accept or decline any order</li>
            <li>Limit quantities purchased</li>
            <li>Refuse service to anyone</li>
            <li>Cancel orders for any reason</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Payment Methods</h3>
          <p className="mb-4">We accept the following payment methods:</p>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li>Cash on Delivery (COD)</li>
            <li>Credit/Debit Cards (when available)</li>
            <li>Other payment methods as displayed at checkout</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Payment Terms</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Payment is due at the time of order placement or delivery</li>
            <li>You authorize us to charge your payment method</li>
            <li>You are responsible for all charges incurred</li>
            <li>Failed payments may result in order cancellation</li>
          </ul>
        </div>

        {/* Section 6 */}
        <div id="shipping" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Package className="w-6 h-6 text-accent" />
            6. Shipping and Delivery
          </h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">Shipping Policy</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li>Shipping times are estimates and not guaranteed</li>
            <li>We are not responsible for shipping delays</li>
            <li>Risk of loss passes to you upon delivery</li>
            <li>You must provide accurate shipping information</li>
            <li>Additional charges may apply for remote locations</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Delivery</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Signature may be required for delivery</li>
            <li>Inspect packages upon delivery</li>
            <li>Report damaged items within 48 hours</li>
            <li>We are not responsible for incorrect addresses</li>
          </ul>
        </div>

        {/* Section 7 */}
        <div id="returns" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">7. Returns and Refunds</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">Return Policy</h3>
          <p className="mb-4">We accept returns within 30 days of delivery if:</p>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li>Items are unused and in original condition</li>
            <li>Original tags and packaging are intact</li>
            <li>You have proof of purchase</li>
            <li>Items are not on the non-returnable list</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Non-Returnable Items</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li>Final sale items</li>
            <li>Personalized or custom products</li>
            <li>Intimate apparel and swimwear</li>
            <li>Items damaged due to misuse</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Refund Process</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Refunds processed within 5-10 business days</li>
            <li>Original shipping costs are non-refundable</li>
            <li>Return shipping costs are your responsibility</li>
            <li>Refunds issued to original payment method</li>
          </ul>
        </div>

        {/* Section 8 */}
        <div id="intellectual-property" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">8. Intellectual Property Rights</h2>
          <p className="mb-4">
            All content on our website, including text, graphics, logos, images, and software, is the property of Noviious or its licensors and is protected by copyright, trademark, and other intellectual property laws.
          </p>
          <p className="mb-4">You may not:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Copy, modify, or distribute our content</li>
            <li>Use our trademarks without permission</li>
            <li>Create derivative works</li>
            <li>Reverse engineer our software</li>
            <li>Remove copyright or trademark notices</li>
          </ul>
        </div>

        {/* Section 9 */}
        <div id="prohibited" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-accent" />
            9. Prohibited Activities
          </h2>
          <p className="mb-4">You are prohibited from:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Using our services for illegal purposes</li>
            <li>Harassing or threatening others</li>
            <li>Posting false or misleading information</li>
            <li>Spamming or sending unsolicited messages</li>
            <li>Attempting to hack or breach security</li>
            <li>Using bots or automated tools</li>
            <li>Reselling products without authorization</li>
            <li>Violating any applicable laws or regulations</li>
          </ul>
        </div>

        {/* Section 10 */}
        <div id="limitation" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
          <p className="mb-4">
            To the fullest extent permitted by law, Noviious shall not be liable for:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li>Indirect, incidental, or consequential damages</li>
            <li>Loss of profits, data, or business opportunities</li>
            <li>Damages resulting from unauthorized access</li>
            <li>Errors or omissions in content</li>
            <li>Third-party actions or content</li>
          </ul>
          <p className="font-semibold">
            Our total liability shall not exceed the amount you paid for the product or service in question.
          </p>
        </div>

        {/* Section 11 */}
        <div id="termination" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">11. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account and access to our services immediately, without prior notice, for:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li>Violation of these Terms</li>
            <li>Fraudulent or illegal activity</li>
            <li>Abuse of our services</li>
            <li>Any other reason at our discretion</li>
          </ul>
          <p>
            Upon termination, your right to use our services will immediately cease. All provisions that should survive termination shall survive, including ownership, warranty disclaimers, and limitations of liability.
          </p>
        </div>

        {/* Section 12 */}
        <div id="governing-law" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">12. Governing Law and Dispute Resolution</h2>
          <p className="mb-4">
            These Terms shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to its conflict of law provisions.
          </p>
          <p className="mb-4">
            Any disputes arising from these Terms or your use of our services shall be resolved through:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Good faith negotiations</li>
            <li>Mediation (if negotiations fail)</li>
            <li>Binding arbitration in New York, NY</li>
          </ol>
        </div>

        {/* Section 13 */}
        <div id="changes" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">13. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these Terms at any time. We will notify you of changes by:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li>Posting the updated Terms on this page</li>
            <li>Updating the "Last updated" date</li>
            <li>Sending email notifications for significant changes</li>
          </ul>
          <p>
            Your continued use of our services after changes constitutes acceptance of the new Terms.
          </p>
        </div>

        {/* Section 14 */}
        <div id="contact" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Mail className="w-6 h-6 text-accent" />
            14. Contact Information
          </h2>
          <p className="mb-4">
            If you have questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-surface dark:bg-gray-800 rounded-lg p-6 space-y-3">
            <p><strong>Email:</strong> <a href="mailto:legal@noviious.com" className="text-accent hover:underline">legal@noviious.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+1-555-123-4567" className="text-accent hover:underline">+1 (555) 123-4567</a></p>
            <p><strong>Address:</strong> Noviious Inc., 123 Fashion Street, New York, NY 10001, USA</p>
            <p><strong>Support:</strong> <a href="/contact" className="text-accent hover:underline">Contact Form</a></p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="card bg-accent/5 border-accent/20">
          <p className="text-sm text-center">
            By using Noviious, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  )
}
