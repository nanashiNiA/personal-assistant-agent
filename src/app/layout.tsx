import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Navigation } from '../components/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'パーソナルアシスタントエージェント',
  description: 'あなたの日常をサポートする知的アシスタント',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Navigation />
        <main className="pt-4">{children}</main>
      </body>
    </html>
  );
}