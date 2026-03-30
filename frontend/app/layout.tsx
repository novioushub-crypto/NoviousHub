import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import WelcomeModal from '@/components/modals/WelcomeModal'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import StructuredData from '@/components/seo/StructuredData'
import { generateOrganizationSchema, generateWebsiteSchema } from '@/lib/seo'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://noviious.com'),
  title: {
    default: 'Noviious - Premium Leather Jackets & Sportswear',
    template: '%s | Noviious',
  },
  description: 'Discover luxury leather jackets and high-performance sportswear. Shop premium quality products with fast shipping and exceptional customer service.',
  keywords: [
    'leather jackets',
    'sportswear',
    'premium clothing',
    'luxury fashion',
    'men\'s jackets',
    'women\'s jackets',
    'athletic wear',
    'fashion',
    'online shopping',
  ],
  authors: [{ name: 'Noviious' }],
  creator: 'Noviious',
  publisher: 'Noviious',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Noviious - Premium Leather Jackets & Sportswear',
    description: 'Discover luxury leather jackets and high-performance sportswear. Shop premium quality products with fast shipping.',
    siteName: 'Noviious',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Noviious - Premium Leather Jackets & Sportswear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noviious - Premium Leather Jackets & Sportswear',
    description: 'Discover luxury leather jackets and high-performance sportswear.',
    images: ['/og-image.jpg'],
    creator: '@noviious',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  other: {
    'msvalidate.01': 'your-bing-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebsiteSchema()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'https://noviious.com'} />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <StructuredData data={[organizationSchema, websiteSchema]} />
        <Providers>
          <WelcomeModal />
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  )
}
