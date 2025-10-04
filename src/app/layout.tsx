import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gabriele Masiero - Software & AI Engineer',
  description: 'Final-year Computer Science student & Software/AI Engineer specializing in Multi-Agent Reinforcement Learning. Building innovative software solutions with Python, Next.js, and modern tech stack.',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  keywords: [
    'Software Engineer',
    'AI Engineer',
    'Machine Learning',
    'Multi-Agent Reinforcement Learning',
    'Python',
    'Next.js',
    'Computer Science',
  ],
  authors: [{ name: 'Gabriele Masiero' }],
  creator: 'Gabriele Masiero',
  metadataBase: new URL('https://gabrielemasiero.dev'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gabrielemasiero.dev',
    title: 'Gabriele Masiero - Software & AI Engineer',
    description:
      'Final-year Computer Science student & Software/AI Engineer specializing in Multi-Agent Reinforcement Learning.',
    siteName: 'Gabriele Masiero Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gabriele Masiero - Software & AI Engineer',
    description:
      'Final-year Computer Science student & Software/AI Engineer specializing in Multi-Agent Reinforcement Learning.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Script
          id="leadinfo-tracker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(l,e,a,d,i,n,f,o){if(!l[i]){l.GlobalLeadinfoNamespace=l.GlobalLeadinfoNamespace||[];
              l.GlobalLeadinfoNamespace.push(i);l[i]=function(){(l[i].q=l[i].q||[]).push(arguments)};l[i].t=l[i].t||n;
              l[i].q=l[i].q||[];o=e.createElement(a);f=e.getElementsByTagName(a)[0];o.async=1;o.src=d;f.parentNode.insertBefore(o,f);}
              }(window,document,'script','https://cdn.leadinfo.net/ping.js','leadinfo','LI-68E0F579CA0B1'));
            `,
          }}
        />
        <main>{children}</main>
      </body>
    </html>
  )
}