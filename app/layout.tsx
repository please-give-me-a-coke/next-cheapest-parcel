import './globals.css'
import Header from 'components/header'
import SystemInfo from 'components/server-info'
import Footer from 'components/footer'
import HNCheapestBox from 'components/HNCheapestBox'

export const metadata = {
  title: 'Cheapest Parcel',
  description: '택배 가격이 다 달라요~',
  robots: {
    index: true,
    follow: true
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
