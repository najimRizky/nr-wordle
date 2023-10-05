import { UserContext } from "@/context/UserContextProvider"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useContext, useEffect, useState } from "react"

export const useLeaderboardPageModel = () => {
  const { data: session } = useSession()
  const [leaderboardData, setLeaderboardData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)
  const { user: userContext } = useContext(UserContext)

  const getLeaderboardData = async () => {
    try {
      const response = await axios.get('/api/leaderboard')
      setLeaderboardData(response.data.data)
    } catch (error: any) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getLeaderboardData()
  }, [])

  return {
    leaderboardData,
    loading,
    userContext,
    session,
  }
}