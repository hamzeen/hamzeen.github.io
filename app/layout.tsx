import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import './globals.css';


export const metadata: Metadata = {
  title: 'Hamzeen | Portfolio',
  description: 'Portfolio and technical blog by Hamzeen Hameem.',
  metadataBase: new URL('https://hamzeen.github.io')
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
