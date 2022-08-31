import Link from 'next/link'

function Navbar() {
  return (
    <div className="bg-slate-700 text-white flex flex-col w-full items-center justify-center px-20 text-center">
      <Link href="/">
        <a className="mt-6 text-4xl font-bold">Welcome to Recipe Drawer</a>
      </Link>
      <div className="m-6">
        <Link href="/signup">
          <a className="m-3 text-xl">Signup</a>
        </Link>
        <Link href="/signin">
          <a className="m-3 text-xl">Signin</a>
        </Link>
        <Link href="/dashboard">
          <a className="m-3 text-xl">Dashboard</a>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
