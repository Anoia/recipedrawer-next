import type { NextPage } from 'next'
import Head from 'next/head'

import RecipeList from '../components/recipelist'

const Home: NextPage = () => {
  return (
    <div className="flex  items-center justify-center py-16">
      <Head>
        <title>Recipe Drawer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex w-full  justify-center text-center">
        <RecipeList />
      </div>
    </div>
  )
}

export default Home
