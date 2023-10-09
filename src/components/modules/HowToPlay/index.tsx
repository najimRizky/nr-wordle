import Modal from '@/components/base/Modal'
import React from 'react'
import { HowToPlayProps } from './interface'
import BlockCharAnswer from '../BlockCharAnswer'
import { Answer } from '@/components/pages/PlayPage/interface'

const answer: Answer[] = [
  {
    character: "P",
    status: "wrong"
  },
  {
    character: "L",
    status: "almost"
  },
  {
    character: "A",
    status: "almost"
  },
  {
    character: "Y",
    status: "wrong"
  },
  {
    character: "S",
    status: "correct"
  }
]

const HowToPlay = ({ closeModal, isModalOpen }: HowToPlayProps) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title="How To Play"
    >
      <div className="grid gap-6 text-center">
        <p>
          You have <b>6 tries</b> to guess the word. If you guess the word correctly, you win. If you run out of tries, you lose.
        </p>
        <div className="flex gap-2 justify-center">
          {answer?.map((item, idItem) => (
            <BlockCharAnswer
              key={idItem}
              answer={answer}
              currentTry={1}
              idAnswer={0}
              idItem={idItem}
              character={item.character}
              status={item.status}
            />
          ))}
        </div>
        <div className="grid gap-2">
          <div className="flex gap-2 justify-center">
            {answer?.filter((item) => item.status === "wrong").map((item, idItem) => (
              <BlockCharAnswer
                key={idItem}
                answer={answer}
                currentTry={1}
                idAnswer={0}
                idItem={idItem}
                character={item.character}
                status={item.status}
              />
            ))}
          </div>
          <p>
            These characters are not in the word.
          </p>
        </div>
        <div className="grid gap-2">
          <div className="flex gap-2 justify-center">
            {answer?.filter((item) => item.status === "almost").map((item, idItem) => (
              <BlockCharAnswer
                key={idItem}
                answer={answer}
                currentTry={1}
                idAnswer={0}
                idItem={idItem}
                character={item.character}
                status={item.status}
              />
            ))}
          </div>
          <p>
            These characters are in the word, but not in the right position.
          </p>
        </div>
        <div className="grid gap-2">
          <div className="flex gap-2 justify-center">
            {answer?.filter((item) => item.status === "correct").map((item, idItem) => (
              <BlockCharAnswer
                key={idItem}
                answer={answer}
                currentTry={1}
                idAnswer={0}
                idItem={idItem}
                character={item.character}
                status={item.status}
              />
            ))}
          </div>
          <p>
            This character is in the word and in the right position.
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default HowToPlay