import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Campaign Module Builder',
  description: 'Build and export campaign pages with modular blocks',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
