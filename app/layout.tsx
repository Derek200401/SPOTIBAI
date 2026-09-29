import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SPOTIBAI',
  description: 'A Spotify-inspired music experience built for the web.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
