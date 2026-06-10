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
  themeColor: '#F9F6EE',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="h-full" style={{ background: '#F9F6EE' }}>
      <body className="h-full antialiased" style={{ background: '#F9F6EE' }}>
        {children}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
