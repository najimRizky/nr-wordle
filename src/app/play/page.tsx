"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import TrashIcon from '@/components/icons/TrashIcon'
import BackspaceIcon from '@/components/icons/BackspaceIcon'
import { deepClone } from '@/helper/object'
import axios from 'axios'
import StatusType from '@/types/StatusType'

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
  }, [answers, currentTry]);

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
    if (character === 'backspace') {
      handleDelete();
    } else if (character === 'clear') {
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
      const isValid = await submitAnswer()
      if (isValid) {
        setCurrentTry(currentTry + 1)
      }
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
        setWord(data?.word)
        setIsWin(data?.isCorrect)
      }
      return true
    } catch (error: any) {
      console.log(error.response.data)
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

  return (
    <div className="container">

      {/* Word Input */}
      <div className="flex flex-col gap-2">
        {answers?.map((answer, idAnswer) => (
          <div className="flex gap-2 justify-center" key={idAnswer}>
            {answer?.map((item, idItem) => (
              <div
                key={idItem}
                className={`
                flex w-[48px] h-[48px] justify-center items-center border-gray-700 border-2 text-2xl font-bold uppercase
                ${(!item.status) ? 'bg-transparent'
                    : item.status === "wrong" ? 'bg-gray-700 text-white'
                      : item.status === "correct" ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-yellow-500 border-yellow-500'
                  }  
                
              `}
              >
                {item.character}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Keyboard */}
      <div className="flex flex-col gap-2 items-center mt-16 uppercase" >
        <div className="grid-cols-10 grid gap-2">
          {keyboardChars[0].split('').map((character, x) => (
            <div
              key={x}
              onClick={() => handleKeyboardType(character)}
              className={`
                flex w-[48px] h-[48px] justify-center items-center bg-gray-300 text-2xl font-bold cursor-pointer
                ${keyboardSats[character] === 'correct' ? 'bg-green-600 border-green-600 text-white'
                  : keyboardSats[character] === 'almost' ? 'bg-yellow-500 border-yellow-500'
                    : keyboardSats[character] === 'wrong' ? 'bg-gray-700 text-white'
                      : ''
                }
            `}
            >
              {character}
            </div>
          ))}
        </div>
        <div className="grid-cols-10 grid gap-2">
          {keyboardChars[1].split('').map((character, x) => (
            <div
              key={x}
              onClick={() => handleKeyboardType(character)}
              className={`
                flex w-[48px] h-[48px] justify-center items-center bg-gray-300 text-2xl font-bold cursor-pointer
                ${keyboardSats[character] === 'correct' ? 'bg-green-600 border-green-600 text-white'
                  : keyboardSats[character] === 'almost' ? 'bg-yellow-500 border-yellow-500'
                    : keyboardSats[character] === 'wrong' ? 'bg-gray-700 text-white'
                      : ''}
              `}
            >
              {character}
            </div>
          ))}
          <div
            className="flex justify-center items-center bg-gray-300 text-2xl font-bold cursor-pointer"
            onClick={() => handleKeyboardType('backspace')}
          >
            <BackspaceIcon width={22} />
          </div>
        </div>
        <div className="grid-cols-10 grid gap-2">
          {keyboardChars[2].split('').map((character, x) => (
            <div
              key={x}
              onClick={() => handleKeyboardType(character)}
              className={`
                flex w-[48px] h-[48px] justify-center items-center bg-gray-300 text-2xl font-bold cursor-pointer
                ${keyboardSats[character] === 'correct' ? 'bg-green-600 border-green-600 text-white'
                  : keyboardSats[character] === 'almost' ? 'bg-yellow-500 border-yellow-500'
                    : keyboardSats[character] === 'wrong' ? 'bg-gray-700 text-white'
                      : ''
                }`}
            >
              {character}
            </div>
          ))}
          <div
            className="flex col-span-2 justify-center items-center bg-gray-300 text-lg font-bold cursor-pointer capitalize"
            onClick={() => handleKeyboardType('enter')}
          >
            Enter
          </div>
          <div
            className="flex justify-center items-center bg-gray-300 text-2xl font-bold cursor-pointer"
            onClick={() => handleKeyboardType('delete')}
          >
            <TrashIcon width={28} />
          </div>
        </div>
      </div>
      {isWin !== undefined && (
        // Modal
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-sm p-8">
            <div className="text-xl font-bold text-center">
              {isWin ? "Congratulations" : "Oops, you lose"}
            </div>
            <div className="text-center">The word is <span className="font-bold">{word}</span></div>
            <div className="flex justify-center mt-4">
              <button
                className="bg-green-600 text-white rounded-sm px-4 py-2"
                onClick={resetLevel}
              >
                Next Level
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayPage