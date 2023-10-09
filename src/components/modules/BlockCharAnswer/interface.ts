import { Answer } from "@/components/pages/PlayPage/interface"

export interface BlockCharAnswerProps {
  character: Answer['character']
  status: Answer['status']
  idItem: number
  idAnswer: number
  answer: Answer[]
  currentTry: number
  loading?: boolean
}