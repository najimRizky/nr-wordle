import axios from "axios"
import { useState } from "react"
import { UserFormProps } from "./interface"

export const useUserFormModel = ({data, onSuccess}: UserFormProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: data?.username || '',
    country: data?.country?.toUpperCase() || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<boolean>()

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const res = await axios.put('/api/user', formData)

      setError(false)
      setLoading(false)
      setTimeout(() => {
        closeModal()
      }, 1000)
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (error: any) {
      console.log(error)
      setError(true)
    }
  }

  return {
    isModalOpen,
    openModal,
    closeModal,
    formData,
    handleChange,
    handleSubmit,
    loading,
    error
  }
}