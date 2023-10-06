import { UserContext } from "@/context/UserContextProvider"
import { deepClone } from "@/helper/object"
import StatusType from "@/types/StatusType"
import axios from "axios"
import { animate } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useContext, useEffect, useRef, useState } from "react"
import { Answer } from "./interface"

const initialAnswer: Answer = {
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

export const usePlayPageModel = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const inValidWordRef: any = useRef([])

  const length = Number(searchParams.get('length')) || 0

  const [keyboardSats, setKeyboardSats] = useState({ ...initialKeyboardSats })
  const [currentTry, setCurrentTry] = useState(0)
  const [isWin, setIsWin] = useState<boolean | undefined>()
  const [word, setWord] = useState('')
  const [answers, setAnswers] = useState<Answer[][]>(
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
    const newAnswers: Answer[][] = deepClone(answers)
    const currentAnswer: Answer[] = newAnswers[currentTry]
    const lastAnswerIndex = currentAnswer.findLastIndex((item) => item.character !== '')
    if (lastAnswerIndex !== -1) {
      currentAnswer[lastAnswerIndex] = initialAnswer
      setAnswers(newAnswers)
    }
  }

  const handleClear = () => {
    const newAnswers: Answer[][] = deepClone(answers)
    const currentAnswer: Answer[] = newAnswers[currentTry]
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
    const newAnswers: Answer[][] = deepClone(answers)
    const currentAnswer: Answer[] = newAnswers[currentTry]
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
            newStats.percentage = (newStats.wins / newStats.total)
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

  const updateAnswer = (newAnswer: Answer[]) => {
    const newAnswers: Answer[][] = deepClone(answers)
    newAnswers[currentTry] = newAnswer
    setAnswers(newAnswers)
  }

  const updateKeyboardSats = (lastAnswer: Answer[]) => {
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

  return {
    answers,
    currentTry,
    isWin,
    word,
    keyboardSats,
    loading,
    resetLevel,
    inValidWordRef,
    handleKeyboardType,
    keyboardChars,
    stats
  }
}