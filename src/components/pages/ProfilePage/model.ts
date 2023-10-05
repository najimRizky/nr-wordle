import { UserContext } from "@/context/UserContextProvider"
import axios from "axios"
import { useState, useContext, useEffect } from "react"

export const useProfilePageModel = () => {
  const [profileData, setProfileData] = useState<any>()
  const [loading, setLoading] = useState(true)
  const { updateUser } = useContext(UserContext)

  const getProfileData = async (updateContext: boolean = false) => {
    setLoading(true)
    try {
      const response = await axios.get('/api/user')
      setProfileData(response.data.data)
      if (updateContext) {
        updateUser(response.data.data.user)
      }

    } catch (error: any) {
      console.log(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    getProfileData()
  }, [])

  const handleSuccess = () => {
    getProfileData(true)
  }

  return {
    profileData,
    loading,
    handleSuccess
  }
}