import Footer from '@/components/modules/Footer'
import './globals.css'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import Header from '@/components/modules/Header'
import SessionProvider from '@/components/modules/SessionProvider'
import { getServerSession } from 'next-auth'
import authOptions from '@/config/authOptions'

const nunito = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NAZ - Wordle | Wordle solver Game by Najim Rizky',
  description: 'Challenge your word skills with Naz WORDLE, a dynamic wordle game offering various character lengths, competitive gameplay with leaderboards, and save your progress.',
  robots: 'index, follow',
  authors: [
    {
      name: 'Najim Rizky',
      url: 'https://najim-rizky.com'
    }
  ],
  publisher: 'Najim Rizky',
  openGraph: {
    type: "website",
    url: "https://naz-wordle.vercel.app",
    images: [
      {
        url: "https://naz-wordle.vercel.app/og-image.png",
        type: "image/png",
        alt: "Wordle",
      },
    ],
    siteName: "NAZ Wordle",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  return (
    <html lang="en">
      <body className={nunito.className}>
        <SessionProvider session={session}>
          <Header />
          <main >
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
