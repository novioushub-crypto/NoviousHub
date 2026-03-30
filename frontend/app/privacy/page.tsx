import { Metadata } from 'next'
import { Shield, Lock, Eye, Database, Mail, UserCheck, Globe, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Noviious collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface dark:bg-surface-dark">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Privacy Policy</h1>
          <p className="text-text-secondary text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Introduction */}
        <div className="card mb-8">
          <p className="text-lg leading-relaxed">
            At Noviious, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-accent" />
            Table of Contents
          </h2>
          <ol className="space-y-2 list-decimal list-inside text-accent">
            <li><a href="#information-we-collect" className="hover:underline">Information We Collect</a></li>
            <li><a href="#how-we-use" className="hover:underline">How We Use Your Information</a></li>
            <li><a href="#disclosure" className="hover:underline">Disclosure of Your Information</a></li>
            <li><a href="#data-security" className="hover:underline">Data Security</a></li>
            <li><a href="#cookies" className="hover:underline">Cookies and Tracking</a></li>
            <li><a href="#third-party" className="hover:underline">Third-Party Services</a></li>
            <li><a href="#your-rights" className="hover:underline">Your Privacy Rights</a></li>
            <li><a href="#children" className="hover:underline">Children's Privacy</a></li>
            <li><a href="#changes" className="hover:underline">Changes to This Policy</a></li>
            <li><a href="#contact" className="hover:underline">Contact Us</a></li>
          </ol>
        </div>

        {/* Section 1 */}
        <div id="information-we-collect" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Database className="w-6 h-6 text-accent" />
            1. Information We Collect
          </h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">Personal Information</h3>
          <p className="mb-4">We collect information that you provide directly to us, including:</p>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li><strong>Account Information:</strong> Name, email address, password, phone number</li>
            <li><strong>Billing Information:</strong> Shipping address, billing address</li>
            <li><strong>Payment Information:</strong> Payment method details (processed securely by our payment providers)</li>
            <li><strong>Order Information:</strong> Purchase history, order details, preferences</li>
            <li><strong>Communication:</strong> Messages, reviews, customer support inquiries</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Automatically Collected Information</h3>
          <p className="mb-4">When you visit our website, we automatically collect:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent, clicks, navigation paths</li>
            <li><strong>Location Data:</strong> General geographic location based on IP address</li>
            <li><strong>Cookies:</strong> See our Cookies section for more details</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div id="how-we-use" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-accent" />
            2. How We Use Your Information
          </h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders and account</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Personalize your shopping experience</li>
            <li>Prevent fraud and enhance security</li>
            <li>Comply with legal obligations</li>
            <li>Analyze usage patterns and trends</li>
            <li>Provide customer support</li>
            <li>Send you important updates and notifications</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div id="disclosure" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-accent" />
            3. Disclosure of Your Information
          </h2>
          <p className="mb-4">We may share your information with:</p>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">Service Providers</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li>Payment processors (for secure payment processing)</li>
            <li>Shipping companies (for order delivery)</li>
            <li>Email service providers (for communications)</li>
            <li>Analytics providers (for website improvement)</li>
            <li>Cloud hosting services (for data storage)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Legal Requirements</h3>
          <p className="mb-4">We may disclose your information if required by law or in response to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Legal processes or government requests</li>
            <li>Protection of our rights and property</li>
            <li>Prevention of fraud or illegal activities</li>
            <li>Protection of user safety</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div id="data-security" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-accent" />
            4. Data Security
          </h2>
          <p className="mb-4">We implement appropriate security measures to protect your information:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Encryption:</strong> SSL/TLS encryption for data transmission</li>
            <li><strong>Secure Storage:</strong> Encrypted databases and secure servers</li>
            <li><strong>Access Controls:</strong> Limited access to personal information</li>
            <li><strong>Regular Audits:</strong> Security assessments and updates</li>
            <li><strong>Payment Security:</strong> PCI DSS compliant payment processing</li>
          </ul>
          <p className="mt-4 text-sm text-text-secondary">
            However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
          </p>
        </div>

        {/* Section 5 */}
        <div id="cookies" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">5. Cookies and Tracking Technologies</h2>
          <p className="mb-4">We use cookies and similar tracking technologies to:</p>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-4">
            <li>Remember your preferences and settings</li>
            <li>Keep you logged in</li>
            <li>Analyze website traffic and usage</li>
            <li>Personalize content and advertisements</li>
            <li>Improve website functionality</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Types of Cookies We Use</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Essential Cookies:</strong> Required for website functionality</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how you use our site</li>
            <li><strong>Marketing Cookies:</strong> Used to show relevant advertisements</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
          </ul>
          <p className="mt-4">
            You can control cookies through your browser settings. Note that disabling cookies may affect website functionality.
          </p>
        </div>

        {/* Section 6 */}
        <div id="third-party" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">6. Third-Party Services</h2>
          <p className="mb-4">Our website may contain links to third-party websites and services:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Google Analytics (website analytics)</li>
            <li>Payment processors (secure payments)</li>
            <li>Social media platforms (sharing features)</li>
            <li>Shipping carriers (order tracking)</li>
          </ul>
          <p className="mt-4 text-sm text-text-secondary">
            These third parties have their own privacy policies. We are not responsible for their practices.
          </p>
        </div>

        {/* Section 7 */}
        <div id="your-rights" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-accent" />
            7. Your Privacy Rights
          </h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Access:</strong> Request a copy of your personal information</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
            <li><strong>Object:</strong> Object to certain data processing activities</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, please contact us at{' '}
            <a href="mailto:privacy@noviious.com" className="text-accent hover:underline">
              privacy@noviious.com
            </a>
          </p>
        </div>

        {/* Section 8 */}
        <div id="children" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
          <p>
            Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
          </p>
        </div>

        {/* Section 9 */}
        <div id="changes" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">9. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Posting the new Privacy Policy on this page</li>
            <li>Updating the "Last updated" date</li>
            <li>Sending you an email notification (for significant changes)</li>
          </ul>
          <p className="mt-4">
            We encourage you to review this Privacy Policy periodically for any changes.
          </p>
        </div>

        {/* Section 10 */}
        <div id="contact" className="card mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Mail className="w-6 h-6 text-accent" />
            10. Contact Us
          </h2>
          <p className="mb-4">
            If you have questions or concerns about this Privacy Policy, please contact us:
          </p>
          <div className="bg-surface dark:bg-gray-800 rounded-lg p-6 space-y-3">
            <p><strong>Email:</strong> <a href="mailto:privacy@noviious.com" className="text-accent hover:underline">privacy@noviious.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+1-555-123-4567" className="text-accent hover:underline">+1 (555) 123-4567</a></p>
            <p><strong>Address:</strong> Noviious Inc., 123 Fashion Street, New York, NY 10001, USA</p>
            <p><strong>Support:</strong> <a href="/contact" className="text-accent hover:underline">Contact Form</a></p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="card bg-accent/5 border-accent/20">
          <p className="text-sm text-center">
            By using our website, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
          </p>
        </div>
      </div>
    </div>
  )
}
