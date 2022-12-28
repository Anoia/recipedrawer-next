import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { supabase } from '../utils/supabaseClient'
import { Fragment, useEffect, useState } from 'react'

function Navbar() {
  const [user, setUser] = useState<User | null>()

  useEffect(() => {
    const getProfile = async () => {
      const profile = await supabase.auth.getUser()

      if (profile) {
        setUser(profile.data.user)
      } else {
        setUser(null)
      }
    }

    getProfile()
  })

  return (
    <div className="bg-slate-700 text-white flex flex-col w-full items-center justify-center px-20 text-center">
      <Link href="/">
        <a className="mt-6 text-4xl font-bold">Welcome to Recipe Drawer</a>
      </Link>
      <div className="m-6">
        {!user && (
          <Fragment>
            <Link href="/signup">
              <a className="m-3 text-xl">Signup</a>
            </Link>
            <Link href="/signin">
              <a className="m-3 text-xl">Signin</a>
            </Link>
          </Fragment>
        )}
        {user && (
          <Link href="/dashboard">
            <a className="m-3 text-xl">Dashboard</a>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Navbar
