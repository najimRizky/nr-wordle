import { useEffect, useState } from "react"

export const useHomePageModel = () => {
  const [initial, setInitial] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)

  const handlePlay = () => {
    setInitial(false)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => {
        if (prev === 2) {
          return 0
        } else {
          return prev + 1
        }
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [wordIndex])

  return {
    initial,
    wordIndex,
    handlePlay,
  }
}