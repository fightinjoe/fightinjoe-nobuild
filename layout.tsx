import { Inter } from 'next/font/google'
import Script from 'next/script';
import './global.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">

      <Script
        strategy="lazyOnload"
        src={
          'https://www.googletagmanager.com/gtag/js?id=' +
          process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
        }
      />

      <Script strategy="lazyOnload" id="ga">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
      `}</Script>

      <body className={`${inter.className} antialiased h-screen`}>
        {children}
      </body>
    </html>
  );
}
