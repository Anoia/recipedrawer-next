import React, { MouseEventHandler, useEffect, useState } from 'react'

import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

const Dashboard = () => {
  const router = useRouter()
  const supabaseClient = useSupabaseClient()
  const [user, setUser] = useState<User | null>()

  const handleLogOut: MouseEventHandler = async (e) => {
    e.preventDefault()

    const { error } = await supabaseClient.auth.signOut()

    if (error) {
      alert(JSON.stringify(error))
    } else {
      router.push('/')
    }
  }

  useEffect(() => {
    const getProfile = async () => {
      const profile = await supabaseClient.auth.getUser()

      if (profile) {
        setUser(profile.data.user)
      } else {
        setUser(null)
      }
    }

    getProfile()
  }, [router, supabaseClient.auth])

  if (!user) {
    // Currently loading asynchronously User Supabase Information
    return null
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-2xl font-semibold text-white">
          Welcome, your email is {user.email}
        </h1>

        <button
          className="mt-6 text-lg text-white font-semibold bg-green-500 py-3 px-6 rounded-md focus:outline-none focus:ring-2"
          onClick={handleLogOut}
        >
          Log out
        </button>
      </div>
    </div>
  )
}

export default Dashboard
