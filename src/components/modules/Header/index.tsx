"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import wordleProps from "@/config/wordleProps"
import Link from "next/link"
import { signIn, useSession, signOut } from "next-auth/react"

const excludeHeader = ['/login', '/']

const Header = () => {
  const pathname = usePathname()
  const { data: session } = useSession()
  if (excludeHeader.includes(pathname)) return null
  return (
    <header className="container py-4">
      <div className="flex justify-between">
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

        {session ? (
          <button onClick={() => signOut()} className="font-bold text-sm flex items-center gap-x-2 bg-gray-800 px-4 py-2 rounded-sm hover:bg-gray-700 duration-300 text-white">
            Sign Out
          </button>
        ) : (
          <button onClick={() => signIn()} className="font-bold text-sm flex items-center gap-x-2 bg-gray-800 px-4 py-2 rounded-sm hover:bg-gray-700 duration-300 text-white">
            Sign In
          </button>
        )}
      </div>
    </header >
  )
}

export default Header