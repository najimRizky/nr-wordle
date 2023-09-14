"use client"
import UserContextProvider, { UserContext } from "@/context/UserContextProvider"
import { getLocalStorage, setLocalStorage } from "@/helper/localStorage"
import axios from "axios"
import { SessionProvider as SessionProviderNextAuth } from "next-auth/react"
import { useContext, useEffect } from "react"

const SessionProvider = ({ children, session }: any) => {
  const { setUser } = useContext(UserContext)
  const initialUser = async () => {
    try {
      const stats = getLocalStorage('stats')
      const user = await axios.post('/api/user', {
        ...stats
      })
      setLocalStorage('user', user.data.data)
      setUser(user.data.data)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])
  return (
    <SessionProviderNextAuth session={session}>
      <UserContextProvider>
        {children}
      </UserContextProvider>
    </SessionProviderNextAuth>
  )
}

export default SessionProvider