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
      <Link href="/" className="mt-6 text-4xl font-bold">
        Welcome to Recipe Drawer
      </Link>
      <div className="m-6">
        {!user && (
          <Fragment>
            <Link href="/signup" className="m-3 text-xl">
              Signup
            </Link>
            <Link href="/signin" className="m-3 text-xl">
              Signin
            </Link>
          </Fragment>
        )}
        {user && (
          <Fragment>
            <Link href="/dashboard" className="m-3 text-xl">
              Dashboard
            </Link>
            <Link href="/create" className="m-3 text-xl">
              Create
            </Link>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default Navbar
