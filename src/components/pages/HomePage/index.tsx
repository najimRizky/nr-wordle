"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"


const wordleProps = [
  {
    char: "W",
    bgColor: "bg-red-500",
    delay: 1.5
  },
  {
    char: "O",
    bgColor: "bg-blue-500",
    delay: 1.8
  },
  {
    char: "R",
    bgColor: "bg-green-500",
    delay: 1.3
  },
  {
    char: "D",
    bgColor: "bg-yellow-500",
    delay: 1.6
  },
  {
    char: "L",
    bgColor: "bg-purple-500",
    delay: 1.4
  },
  {
    char: "E",
    bgColor: "bg-pink-500",
    delay: 1.7
  },
]

const levelSelections = [
  {
    length: 3,
    words: ["EAR", "ETA", "TAX"],
  },
  {
    length: 4,
    words: ["EARN", "TIME", "BUSY"],
  },
  {
    length: 5,
    words: ["EARTH", "TIGER", "BRAVE"],
  },
  {
    length: 6,
    words: ["EASTER", "TIGERS", "BRAVES"],
  },
  {
    length: 7,
    words: ["ASTEROID", "PANCAKES", "CUPCAKES"],
  },
  {
    length: 8,
    words: ["DISASTER", "LAVENDER", "MAGNETIC"],
  },
  {
    length: 9,
    words: ["EARTHQUAKE", "TIGERWOODS", "BRAVEHEART"],
  },
  {
    length: 10,
    words: ["BALLASTING", "GLAMOURING", "CIRCULATED"],
  },
  {
    length: 11,
    words: ["DISASTEROUS", "LAVENDERING", "MAGNETIZING"],
  },
]

const HomePage = () => {
  const [initial, setInitial] = useState(true)

  const handlePlay = () => {
    setInitial(false)
  }

  return (
    <div className="container ">
      <motion.div
        layout
        className="flex items-center justify-center flex-col min-h-screen"
        transition={{
          duration: 0.5,
          type: "tween"
        }}
      >
        <div className="font-bold text-3xl flex items-center gap-x-2">
          <h1 className="tracking-widest">
            Naz -
          </h1>
          {wordleProps.map((letter, index) => (
            <div
              className="relative w-[48px] h-[48px]"
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
        </div>
        <div className={`w-[550px] relative flex justify-center duration-500 ${initial ? "h-40" : "h-80"}`}>
          <AnimatePresence>
            {initial && (
              <motion.div
                className="flex flex-col gap-4 mt-16"
                initial={{
                  x: 100,
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                  }
                }}
                exit={{
                  x: 100,
                  opacity: 0,
                  transition: {
                    duration: 0.5,
                  }
                }}
              >
                <button
                  onClick={handlePlay}
                  className="bg-gray-700 font-bold w-48 px-4 py-2 rounded-sm text-white hover:bg-gray-600 duration-300"
                >
                  Play
                </button>
                <button className="bg-gray-700 font-bold w-48 px-4 py-2 rounded-sm text-white hover:bg-gray-600 duration-300">
                  How to Play
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!initial && (
              <motion.div
                className="absolute top-0 left-0 w-full"
                initial={{
                  x: 100,
                  opacity: 0,
                  visibility: "hidden",
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  visibility: "visible",
                  transition: {
                    duration: 0.5,
                    delay: 0.5,
                    type: "tween"
                  }
                }}
                exit={{
                  x: 100,
                  opacity: 0,
                  visibility: "hidden",
                  transition: {
                    duration: 0.5,
                    type: "tween"
                  }
                }}
              >
                <p className="text-center mt-12 mb-4 font-normal">
                  Choose character length:
                </p>
                <div
                  className="grid grid-cols-3 ">
                  {levelSelections.map((level, index) => (
                    <Link
                      href={`/play?length=${level.length}`}
                      key={index}
                      className="p-4 border-2 border-transparent hover:border-gray-600 rounded-sm cursor-pointer duration-300"

                    >
                      <p className="text-center text-sm">{level.length} Characters</p>
                      <div
                        className="w-36 font-bold py-1 mt-1 bg-gray-300 rounded-sm flex justify-center items-center mx-auto"
                      >
                        {level.words[0]}
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div >
  )
}

export default HomePage