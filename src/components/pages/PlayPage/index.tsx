"use client"

import "./index.css"
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, CSSProperties, useRef, useContext } from 'react'
import TrashIcon from '@/components/icons/TrashIcon'
import BackspaceIcon from '@/components/icons/BackspaceIcon'
import { deepClone } from '@/helper/object'
import axios from 'axios'
import StatusType from '@/types/StatusType'
import { motion, AnimatePresence, animate } from 'framer-motion'
import Link from "next/link"
import { UserContext } from "@/context/UserContextProvider"

interface IAnswer {
  character: string
  status: StatusType
}

const initialAnswer: IAnswer = {
  character: '',
  status: null,
}

const maxTry = 6
const keyboardChars = [
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm"
]


const initialKeyboardSats: {
  [key: string]: StatusType
} = {
  a: null,
  b: null,
  c: null,
  d: null,
  e: null,
  f: null,
  g: null,
  h: null,
  i: null,
  j: null,
  k: null,
  l: null,
  m: null,
  n: null,
  o: null,
  p: null,
  q: null,
  r: null,
  s: null,
  t: null,
  u: null,
  v: null,
  w: null,
  x: null,
  y: null,
  z: null,
}

const PlayPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const inValidWordRef: any = useRef([])

  const length = Number(searchParams.get('length')) || 0

  const [keyboardSats, setKeyboardSats] = useState({ ...initialKeyboardSats })
  const [currentTry, setCurrentTry] = useState(0)
  const [isWin, setIsWin] = useState<boolean | undefined>()
  const [word, setWord] = useState('')
  const [answers, setAnswers] = useState<IAnswer[][]>(
    Array.from({ length: maxTry }).map(() =>
      Array.from({ length }).map(() => initialAnswer)
    )
  )
  const [loading, setLoading] = useState(false)

  const { stats, updateStats } = useContext(UserContext)

  useEffect(() => {
    let isKeydown = false;

    const keydownListener = (e: KeyboardEvent) => {
      if (!isKeydown) {
        isKeydown = true;
        keyboardListener(e);
      }
    };

    const keyupListener = () => {
      isKeydown = false;
    };

    window.addEventListener('keydown', keydownListener);
    window.addEventListener('keyup', keyupListener);

    return () => {
      window.removeEventListener('keydown', keydownListener);
      window.removeEventListener('keyup', keyupListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, currentTry, loading]);

  useEffect(() => {
    if (!length || length < 4 || length > 11) {
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length])

  useEffect(() => {
    generateLevel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleKeyboardType = (character: string) => {
    if (loading) return

    if (character === 'backspace') {
      handleDelete();
    } else if (character === 'delete') {
      handleClear();
    } else if (character === 'enter') {
      handleEnter();
    } else {
      handleAddChar(character);
    }
  }

  const handleDelete = () => {
    const newAnswers: IAnswer[][] = deepClone(answers)
    const currentAnswer: IAnswer[] = newAnswers[currentTry]
    const lastAnswerIndex = currentAnswer.findLastIndex((item) => item.character !== '')
    if (lastAnswerIndex !== -1) {
      currentAnswer[lastAnswerIndex] = initialAnswer
      setAnswers(newAnswers)
    }
  }

  const handleClear = () => {
    const newAnswers: IAnswer[][] = deepClone(answers)
    const currentAnswer: IAnswer[] = newAnswers[currentTry]
    currentAnswer.forEach((item) => {
      item.character = ''
    })
    setAnswers(newAnswers)
  }

  const handleEnter = async () => {
    const isAllAnswered = answers[currentTry].every((item) => item.character !== '')
    if (isAllAnswered && currentTry < maxTry) {
      setLoading(true)
      const isValid = await submitAnswer()
      if (isValid) {
        setCurrentTry(currentTry + 1)
      }
      setLoading(false)
      // setCurrentTry(currentTry + 1)
    }
  }

  const handleAddChar = (character: string) => {
    const newAnswers: IAnswer[][] = deepClone(answers)
    const currentAnswer: IAnswer[] = newAnswers[currentTry]
    const firstAnswerIndex = currentAnswer.findIndex((item) => item.character === '')
    if (firstAnswerIndex !== -1) {
      currentAnswer[firstAnswerIndex].character = character
      setAnswers(newAnswers)
    }
  }

  const keyboardListener = (e: KeyboardEvent) => {
    const character = e.key.toLowerCase()
    const isAlphabet = /[a-z]/.test(character) && character.length === 1
    if (character === 'backspace' || character === 'delete' || character === 'enter' || isAlphabet) {
      handleKeyboardType(character)
    }
  }

  const submitAnswer = async () => {
    try {
      const { data } = await axios.post(`/api/check/`, {
        answer: answers[currentTry].map((item) => item.character).join('')
      })
      updateAnswer(data?.result)
      updateKeyboardSats(data?.result)

      if (data?.word) {
        setTimeout(() => {
          setWord(data?.word)
          setIsWin(data?.isCorrect)
          if (data?.stats) {
            const newStats = data?.stats
            updateStats(newStats)
          } else {
            const newStats = stats || {
              total: 0,
              wins: 0,
              losses: 0,
              percentage: 0
            }
            if (data?.isCorrect) {
              newStats.wins += 1
            } else {
              newStats.losses += 1
            }
            newStats.total += 1
            newStats.percentage = (newStats.wins / newStats.total) * 100
            updateStats(newStats)
          }
        }, (0.2 * length) * 1000)
      }
      return true
    } catch (error: any) {
      const errorMessage = error.response?.data
      if (errorMessage === "Word is not available") {
        animateInvalidWord()
      }
    }
  }

  const updateAnswer = (newAnswer: IAnswer[]) => {
    const newAnswers: IAnswer[][] = deepClone(answers)
    newAnswers[currentTry] = newAnswer
    setAnswers(newAnswers)
  }

  const updateKeyboardSats = (lastAnswer: IAnswer[]) => {
    const newKeyboardSats = { ...keyboardSats }
    lastAnswer.forEach((item) => {
      if (newKeyboardSats[item.character] !== 'wrong' && newKeyboardSats[item.character] !== 'correct') {
        newKeyboardSats[item.character] = item.status
      }
    })
    setKeyboardSats(newKeyboardSats)
  }

  const generateLevel = async () => {
    try {
      await axios.get(`/api/generate?length=${length}`)
    } catch (error) {
      console.log(error)
    }
  }

  const resetLevel = () => {
    setAnswers(Array.from({ length: maxTry }).map(() =>
      Array.from({ length }).map(() => initialAnswer)
    ))
    setKeyboardSats({ ...initialKeyboardSats })
    setCurrentTry(0)
    generateLevel()
    setIsWin(undefined)
  }

  const animateInvalidWord = () => {
    animate(inValidWordRef.current[currentTry], {
      x: [-5, 5, -5, 5, -5, 5, 0],
      transition: {
        duration: 0.1,
      },
    });
  }

  return (
    <>
      <div className="container my-8 flex flex-col justify-between sm:justify-start  min-h-[75vh] sm:min-h-0">

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
                  <motion.div
                    initial={{ scale: 0, opacity: 0, perspective: 1000 }}
                    animate={{
                      scale: 1, opacity: 1
                    }}
                    key={item.character + idItem}
                    className={`w-[32px] xs:w-[36px] sm:w-[48px] h-[32px] xs:h-[36px] sm:h-[48px] xs:text-xl sm:text-2xl font-bold uppercase relative`}
                  >
                    <div
                      className={`
                        w-full rounded-sm h-full answer-tile ${currentTry > idAnswer ? "rotate" : ""}
                        ${(currentTry === idAnswer && loading) ? "animate-[pulse2_1s_infinite]" : ""}
                      `}
                      style={{
                        transformStyle: "preserve-3d",
                        '--delay': `${0.15 * idItem}s`
                      } as CSSProperties}
                    >
                      <div
                        className="absolute top-0 left-0 w-full h-full flex justify-center items-center border-gray-700 border-2 "
                        style={{
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                        }}
                      >
                        {item.character}
                      </div>
                      <div
                        className={`
                        absolute top-0 left-0 w-full h-full flex justify-center items-center
                        ${(!item.status) ? 'bg-transparent'
                            : item.status === "wrong" ? 'bg-gray-700 text-white'
                              : item.status === "correct" ? 'bg-green-600 border-green-600 text-white'
                                : 'bg-yellow-500 border-yellow-500'
                          }
                      `}
                        style={{
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                          transform: "rotateX(180deg)",
                        }}
                      >
                        {item.character}
                      </div>
                    </div>
                  </motion.div>
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
    </>
  )
}

export default PlayPage