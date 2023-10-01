import './globals.css'
import type { Metadata } from 'next'
import { Inter,Space_Grotesk } from 'next/font/google'
import NavBar from '@/components/NavBar'

const inter = Inter({ subsets: ['latin'] })
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],weight:['300','400','500','600','700']
})

export const metadata: Metadata = {
  title: 'PriceWise',
  description: 'Track product prices effortlessly and save money on your online shopping',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        <main className='max-w-10xl mx-auto'>
          {children}
        </main>
      </body>
    </html>
  )
}
