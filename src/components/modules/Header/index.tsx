"use client"

import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import wordleProps from "@/config/wordleProps"
import { signIn, useSession, signOut } from "next-auth/react"
import { useContext, useState } from "react"
import { UserContext } from "@/context/UserContextProvider"
import dynamic from 'next/dynamic'
import Flag from "../Flag"
import { removeLocalStorage } from "@/helper/localStorage"
const Link = dynamic(() => import("next/link"), { ssr: false })

const excludeHeader = ['/login', '/']

const Header = () => {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [profileDropdown, setProfileDropdown] = useState(false)
  const { user } = useContext(UserContext)

  const toggleProfileDropdown = (state: boolean | undefined) => {
    setProfileDropdown(state || !profileDropdown)
  }

  const handleSignOut = () => {
    removeLocalStorage('user')
    removeLocalStorage('isInitialized')
    removeLocalStorage('stats')
    signOut()
  }

  return (
    <header
      className={`
        container py-4
      `}
    >
      <div className="flex justify-between">
        {!excludeHeader.includes(pathname) ? (
          <Link className="font-bold text-md flex items-center gap-x-1" href={"/"} >
            <h1 className="tracking-widest">
              Naz -
            </h1>
            {wordleProps.map((letter, index) => (
              <div
                className="relative w-[24px] h-[24px]"
                key={index}
                style={{
                  perspective: 1000,
                }}
              >
                <motion.div
                  className="w-full h-full"
                  initial={{
                    transformStyle: "preserve-3d",
                  }}
                  animate={{
                    rotateX: 180,
                    transition: {
                      repeat: Infinity,
                      repeatType: "reverse",
                      repeatDelay: letter.delay,
                      delay: letter.delay,
                      duration: 1,
                      type: "tween"
                    }
                  }}
                >
                  <div
                    className="absolute flex w-full h-full justify-center items-center bg-gray-300 rounded-sm"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    {letter.char}
                  </div>
                  <div
                    className={`absolute flex w-full h-full justify-center items-center ${letter.bgColor} rounded-sm top-0 left-0`}
                    style={{
                      transform: "rotateX(180deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",

                    }}
                  >
                    {letter.char}
                  </div>
                </motion.div>
              </div>
            ))}
          </Link>
        ) : (
          <div />
        )}

        {session ? (
          <>
            <div
              className="relative"
              onMouseOver={() => toggleProfileDropdown(true)}
              onMouseLeave={() => toggleProfileDropdown(false)}
            >
              <Link href="/profile" prefetch={false}
                className="text-sm flex items-center gap-x-2 py-2 rounded-sm duration-300"
              >
                @{user?.username} <Flag countryCode={user?.country} />
              </Link  >
              <AnimatePresence>
                {profileDropdown && (
                  <motion.div
                    className="absolute top-full right-0 rounded-b rounded-sm w-[100px] border-4 text-right"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <button onClick={handleSignOut} className="font-bold text-sm flex items-center gap-x-2 px-4 py-2 rounded-sm ">
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <button onClick={() => signIn()} className="font-bold text-sm flex items-center gap-x-2 bg-gray-800 px-4 py-2 rounded-sm hover:bg-gray-700 duration-300 text-white">
            Login
          </button>
        )}
      </div>
    </header >
  )
}

export default Header