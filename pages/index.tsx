import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import RecipeList from '../components/recipelist'

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Test App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">Welcome to Recipe Drawer</h1>
        <div className="mt-5">
          <Link href="/signup">
            <a className="m-3 text-2xl">Signup</a>
          </Link>
          <Link href="/signin">
            <a className="m-3 text-2xl">Signin</a>
          </Link>
          <Link href="/dashboard">
            <a className="m-3 text-2xl">Dashboard</a>
          </Link>
        </div>

        <div className="my-10">
          <RecipeList />
        </div>
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        this is the footer
      </footer>
    </div>
  )
}

export default Home
