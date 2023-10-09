"use client"

import TrashIcon from '@/components/icons/TrashIcon'
import BackspaceIcon from '@/components/icons/BackspaceIcon'
import { motion, AnimatePresence } from 'framer-motion'
import Link from "next/link"
import { usePlayPageModel } from "./model"
import BlockCharAnswer from "@/components/modules/BlockCharAnswer"
import HowToPlay from '@/components/modules/HowToPlay'
import { useHowToPlayModel } from '@/components/modules/HowToPlay/model'

const PlayPage = () => {
  const {
    answers,
    currentTry,
    inValidWordRef,
    isWin,
    keyboardSats,
    loading,
    resetLevel,
    word,
    handleKeyboardType,
    keyboardChars,
    stats
  } = usePlayPageModel()

  const {
    closeModal,
    isModalOpen,
    openModal
  } = useHowToPlayModel()

  return (
    <>
      <div className="container mb-8 flex flex-col justify-between sm:justify-start  min-h-[75vh] sm:min-h-0">
        <button
          onClick={openModal}
          className='ms-auto mb-8 rounded-full w-7 h-7 flex justify-center items-center border-gray-950 border-2 font-bold'
        >
          ?
        </button>
        {/* Word Input */}
        <div
          className="flex flex-col gap-2"
        >
          {answers?.map((answer, idAnswer) => (
            <motion.div
              className="flex gap-2 justify-center"
              key={idAnswer}
              ref={(el) => (inValidWordRef.current[idAnswer] = el) as any}
            >
              {answer?.map((item, idItem) => (
                <AnimatePresence mode='wait' key={idItem}>
                  <BlockCharAnswer
                    answer={answer}
                    currentTry={currentTry}
                    idAnswer={idAnswer}
                    idItem={idItem}
                    loading={loading}
                    character={item.character}
                    status={item.status}
                  />
                </AnimatePresence>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Keyboard */}
        <div className="flex flex-col gap-[1px] xs:gap-2 items-center sm:mt-16 uppercase" >
          <div className="grid-cols-10 grid gap-[1px] xs:gap-2 w-full sm:w-fit">
            {keyboardChars[0].split('').map((character, x) => (
              <button
                key={x}
                onClick={() => handleKeyboardType(character)}
                className={`
                flex rounded-sm w-full xs:w-[36px] sm:w-[48px] h-[64px] sm:h-[48px] justify-center items-center bg-gray-300 sm:text-2xl font-bold cursor-pointer hover:bg-gray-400 duration-300 uppercase
                ${keyboardSats[character] === 'correct' ? 'bg-green-600 border-green-600 text-white'
                    : keyboardSats[character] === 'almost' ? 'bg-yellow-500 border-yellow-500'
                      : keyboardSats[character] === 'wrong' ? 'bg-gray-700 text-white'
                        : ''
                  }
            `}
              >
                {character}
              </button>
            ))}
          </div>
          <div className="grid-cols-10 grid gap-[1px] xs:gap-2 w-full sm:w-fit">
            {keyboardChars[1].split('').map((character, x) => (
              <button
                key={x}
                onClick={() => handleKeyboardType(character)}
                className={`
                flex rounded-sm w-full xs:w-[36px] sm:w-[48px] h-[64px] sm:h-[48px] justify-center items-center bg-gray-300 sm:text-2xl font-bold cursor-pointer hover:bg-gray-400 duration-300 uppercase
                ${keyboardSats[character] === 'correct' ? 'bg-green-600 border-green-600 text-white'
                    : keyboardSats[character] === 'almost' ? 'bg-yellow-500 border-yellow-500'
                      : keyboardSats[character] === 'wrong' ? 'bg-gray-700 text-white'
                        : ''}
              `}
              >
                {character}
              </button>
            ))}
            <button
              className="flex justify-center items-center bg-gray-300 text-2xl font-bold cursor-pointer hover:bg-gray-400 duration-300 uppercase"
              onClick={() => handleKeyboardType('backspace')}
            >
              <BackspaceIcon width={18} />
            </button>
          </div>
          <div className="grid-cols-10 grid gap-[1px] xs:gap-2 w-full sm:w-fit">
            {keyboardChars[2].split('').map((character, x) => (
              <button
                key={x}
                onClick={() => handleKeyboardType(character)}
                className={`
                flex rounded-sm w-full xs:w-[36px] sm:w-[48px] h-[64px] sm:h-[48px] justify-center items-center bg-gray-300 sm:text-2xl font-bold cursor-pointer hover:bg-gray-400 duration-300 uppercase
                ${keyboardSats[character] === 'correct' ? 'bg-green-600 border-green-600 text-white'
                    : keyboardSats[character] === 'almost' ? 'bg-yellow-500 border-yellow-500'
                      : keyboardSats[character] === 'wrong' ? 'bg-gray-700 text-white'
                        : ''
                  }`}
              >
                {character}
              </button>
            ))}
            <button
              className="flex col-span-2 justify-center items-center bg-gray-300 sm:text-lg font-bold cursor-pointer hover:bg-gray-400 duration-300 uppercase"
              onClick={() => handleKeyboardType('enter')}
            >
              Enter
            </button>
            <button
              className="flex justify-center items-center bg-gray-300 text-2xl font-bold cursor-pointer hover:bg-gray-400 duration-300 uppercase"
              onClick={() => handleKeyboardType('delete')}
            >
              <TrashIcon width={24} />
            </button>
          </div>
        </div>
      </div >
      <AnimatePresence>
        {isWin !== undefined && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-sm p-8 min-w-[95vw] sm:min-w-[500px]">
              <div className="text-xl font-bold text-center mb-8">
                {isWin ? "Congratulations" : "Oops, you lose"}
              </div>
              <div className="text-center">The word is:</div>
              <p
                className="text-center text-2xl font-bold mt-2 uppercase"
              >
                {word}
              </p>

              {/* Show stats */}
              <div className="flex justify-center my-12 gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xl">{stats?.total}</div>
                  <div className="text-xl font-bold">Total</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xl">{stats?.wins}</div>
                  <div className="text-xl font-bold">Wins</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xl">{stats?.losses}</div>
                  <div className="text-xl font-bold">Losses</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xl">{(stats?.percentage * 100).toFixed(2)}%</div>
                  <div className="text-xl font-bold">Win Rate</div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 mt-4">
                <button
                  className="bg-green-600 text-white rounded-sm px-4 py-2"
                  onClick={resetLevel}
                >
                  Play Again
                </button>
                <Link
                  href="/"
                  className="hover:underline"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <HowToPlay
        closeModal={closeModal}
        isModalOpen={isModalOpen}
      />
    </>
  )
}

export default PlayPage