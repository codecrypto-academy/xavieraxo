import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Web3Provider } from '@/context/Web3Context';
import NetworkBanner from '@/components/NetworkBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Supply Chain Tracker',
  description: 'Sistema de trazabilidad de cadena de suministro basado en blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Web3Provider>
          <NetworkBanner />
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}

