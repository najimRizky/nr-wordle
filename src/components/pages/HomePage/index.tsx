"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import wordleProps from "@/config/wordleProps"
import levelSelections from "@/config/levelSelections"
import { baseMenuVariant, selectLevelMenuVariant } from "./variant"
import { useHomePageModel } from "./model"
import { useHowToPlayModel } from "@/components/modules/HowToPlay/model"
import HowToPlay from "@/components/modules/HowToPlay"

const HomePage = () => {
  const {
    initial,
    wordIndex,
    handlePlay
  } = useHomePageModel()

  const {
    closeModal,
    isModalOpen,
    openModal
  } = useHowToPlayModel()

  return (
    <>
      <div className="container ">
        <motion.div
          layout
          className="flex items-center justify-center flex-col min-h-[80vh]"
          transition={{
            duration: 0.5,
            type: "tween"
          }}
        >
          <div className="font-bold text-3xl flex flex-col xs:flex-row items-center gap-4">
            <h1 className="tracking-widest">
              Naz <span className="hidden xs:inline">-</span>
            </h1>
            <div className="flex gap-x-2">
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
          </div>
          <div className={`w-full sm:w-[550px] relative flex justify-center delay-500 duration-500 overflow-hidden ${initial ? "h-64" : "h-[54rem] xs:h-[34rem] sm:h-[23rem]"}`}>
            <AnimatePresence initial={false}>
              {initial && (
                <motion.div
                  className="flex flex-col gap-4 mt-16"
                  variants={baseMenuVariant}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <button
                    onClick={handlePlay}
                    className="bg-gray-700 font-bold w-48 px-4 py-2 rounded-sm text-white hover:bg-gray-600 duration-300"
                  >
                    Play
                  </button>
                  <button
                    onClick={openModal}
                    className="bg-gray-700 font-bold w-48 px-4 py-2 rounded-sm text-white hover:bg-gray-600 duration-300"
                  >
                    How to Play
                  </button>
                  <Link href={"/leaderboard"} className="bg-gray-700 font-bold w-48 px-4 py-2 rounded-sm text-white hover:bg-gray-600 duration-300 text-center">
                    Leaderboard
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {!initial && (
                <motion.div
                  className="absolute top-0 left-0 w-full"
                  variants={selectLevelMenuVariant}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <p className="text-center mt-12 mb-4 font-normal">
                    Choose character length:
                  </p>
                  <div
                    className="flex flex-wrap justify-center">
                    {levelSelections.map((level, index) => (
                      <Link
                        href={`/play?length=${level.length}`}
                        key={index}
                        className="p-4 border-2 border-transparent hover:border-gray-600 rounded-sm cursor-pointer duration-300"

                      >
                        <p className="text-center text-sm">{level.length} Characters</p>
                        <div
                          className="w-36 font-bold py-1 mt-1 bg-gray-300 rounded-sm flex justify-center items-center mx-auto overflow-hidden"
                        >
                          <AnimatePresence mode="wait">
                            <motion.p
                              key={wordIndex}
                              initial={{
                                y: wordIndex === 1 ? "100%" : wordIndex === 2 ? "0%" : "0%",
                                x: wordIndex === 1 ? "0" : wordIndex === 2 ? "100%" : "-100%",
                              }}
                              animate={{
                                y: "0%",
                                x: "0%",
                                opacity: 1,
                                transition: {
                                  ease: "easeInOut",
                                }
                              }}
                              exit={{
                                y: wordIndex === 1 ? "-100%" : wordIndex === 2 ? "0%" : "0%",
                                x: wordIndex === 1 ? "0" : wordIndex === 2 ? "-100%" : "100%",
                                opacity: 0,
                                transition: {
                                  ease: "easeInOut",
                                }
                              }}
                            >
                              {level.words[wordIndex]}
                            </motion.p>
                          </AnimatePresence>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div >
      </div >
      <HowToPlay
        isModalOpen={isModalOpen}
        closeModal={closeModal}
      />
    </>
  )
}

export default HomePage