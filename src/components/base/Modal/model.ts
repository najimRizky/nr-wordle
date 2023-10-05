import { useEffect } from "react"

export const useModalModel = ({ isOpen }: { isOpen: boolean }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'
  }, [isOpen])
}