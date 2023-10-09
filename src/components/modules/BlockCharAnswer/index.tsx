import { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { Answer } from '@/components/pages/PlayPage/interface'
import { BlockCharAnswerProps } from './interface'
import "./style.css"

const BlockCharAnswer = ({ character, status, idItem, idAnswer, answer, currentTry, loading = false }: BlockCharAnswerProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, perspective: 1000 }}
      animate={{
        scale: 1, opacity: 1
      }}
      key={character + idItem}
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
          {(currentTry === idAnswer && idItem === answer.findIndex((item: Answer) => item.character === '')) ?
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            >
              _
            </motion.span> : character
          }
        </div>
        <div
          className={`
              absolute top-0 left-0 w-full h-full flex justify-center items-center
              ${(!status) ? 'bg-transparent'
              : status === "wrong" ? 'bg-gray-700 text-white'
                : status === "correct" ? 'bg-green-600 border-green-600 text-white'
                  : 'bg-yellow-500 border-yellow-500'}
            `}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateX(180deg)",
          }}
        >
          {character}
        </div>
      </div>
    </motion.div>
  )
}

export default BlockCharAnswer