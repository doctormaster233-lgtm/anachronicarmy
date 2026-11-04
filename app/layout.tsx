import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sharon Epic Armando — Artist & Developer',
  description:
    'Artist — singer, comic artist, designer, performer. Developer — builds and deploys the web projects, AI tools, and quantum visualizations that come out of that work.',
  openGraph: {
    title: 'Sharon Epic Armando — Artist & Developer',
    description: 'Artist — singer, comic artist, designer, performer. Developer — builds and deploys the web projects, AI tools, and quantum visualizations that come out of that work.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Sharon Epic Armando — Artist & Developer',
    description: 'Artist — singer, comic artist, designer, performer. Developer — builds and deploys the web projects, AI tools, and quantum visualizations that come out of that work.',
  },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f4f0e8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
