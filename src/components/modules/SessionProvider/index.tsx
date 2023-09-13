"use client"
import { getLocalStorage, setLocalStorage } from "@/helper/localStorage"
import axios from "axios"
import { SessionProvider as SessionProviderNextAuth } from "next-auth/react"
import { useEffect } from "react"

const SessionProvider = ({ children, session }: any) => {
  const initialUser = async () => {
    try {
      const stats = getLocalStorage('stats')
      const user = await axios.post('/api/user', {
        ...stats
      })
      setLocalStorage('user', user.data.data)
      setLocalStorage('isInitialized', true)
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(() => {
    if (session) {
      const isInitialized = getLocalStorage('isInitialized')
      if (!isInitialized) initialUser()
    } else {
      setLocalStorage('isInitialized', false)
    }
  }, [session])
  return (
    <SessionProviderNextAuth session={session}>
      {children}
    </SessionProviderNextAuth>
  )
}

export default SessionProvider