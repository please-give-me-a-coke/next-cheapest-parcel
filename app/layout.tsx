import './globals.css'
import Header from 'components/header'
import SystemInfo from 'components/server-info'
import Footer from 'components/footer'
import HNCheapestBox from 'components/HNCheapestBox'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://cheapest-parcel.vercel.app'),
  title: 'Cheapest Parcel - 택배 요금 비교 서비스',
  description: '편의점 택배 요금을 한눈에 비교하세요.',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: 'https://cheapest-parcel.vercel.app',
    title: 'Cheapest Parcel - 택배 요금 비교 서비스',
    description: '편의점 택배 요금을 한눈에 비교하세요.'
  }
}

export const viewport = {
  themeColor: '#ffa52a'
}

export default function RootLayout() {
  return (
    <html lang="en">
      <body>
        <main>
          <Header />
          <div className="page">
            <HNCheapestBox />
            <Footer />
            <SystemInfo />
          </div>
        </main>
      </body>
    </html>
  )
}
