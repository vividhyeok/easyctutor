import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '쉬운 C언어',
  description: 'IDE를 켜두고 직접 코드를 따라 치며 학습하는 C언어 교재',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* Preload fonts if possible or relying on CSS */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
