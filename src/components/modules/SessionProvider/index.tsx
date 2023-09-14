"use client"

import UserContextProvider from "@/context/UserContextProvider"
import { SessionProvider as SessionProviderNextAuth } from "next-auth/react"

const SessionProvider = ({ children, session }: any) => {
  return (
    <SessionProviderNextAuth session={session}>
      <UserContextProvider session={session}>
        {children}
      </UserContextProvider>
    </SessionProviderNextAuth>
  )
}

export default SessionProvider