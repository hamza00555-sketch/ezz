import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ServiceWorkerRegistrar } from '@/components/ServiceWorkerRegistrar';

export const metadata: Metadata = {
  title: 'عز — إدارة بيتك بكل حب',
  description: 'تطبيق عائلي لإدارة شؤون البيت',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'عز',
  },
  icons: {
    apple: '/icons/icon-180.png',
    icon: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F2EC' },
    { media: '(prefers-color-scheme: dark)',  color: '#07111F' },
  ],
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="h-full" style={{ background: '#F7F2EC' }}>
      <body className="h-full antialiased" style={{ background: 'var(--color-bg, #F7F2EC)' }}>
        {children}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
