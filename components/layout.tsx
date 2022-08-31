import Footer from './footer'
import Navbar from './navbar'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="flex flex-col h-screen">
        <Navbar />
        <main className="grow">{children}</main>
        <Footer />
      </div>
    </>
  )
}
