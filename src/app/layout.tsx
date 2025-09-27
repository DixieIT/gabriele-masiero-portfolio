import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
  keywords: ['Software Engineer', 'AI Engineer', 'Machine Learning', 'Multi-Agent Reinforcement Learning', 'Python', 'Next.js', 'Computer Science'],
  authors: [{ name: 'Gabriele Masiero' }],
  creator: 'Gabriele Masiero',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gabrielemasiero.dev',
    title: 'Gabriele Masiero - Software & AI Engineer',
    description: 'Final-year Computer Science student & Software/AI Engineer specializing in Multi-Agent Reinforcement Learning.',
    siteName: 'Gabriele Masiero Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gabriele Masiero - Software & AI Engineer',
    description: 'Final-year Computer Science student & Software/AI Engineer specializing in Multi-Agent Reinforcement Learning.',
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
        
        <main>{children}</main>
      </body>
    </html>
  )
}