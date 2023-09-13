"use client"

import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

const LeaderboardPage = () => {
  const { data: session } = useSession()
  const [leaderboardData, setLeaderboardData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)

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

  return (
    <div className="container my-8">
      <h1 className="text-center text-lg">LEADERBOARD</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <table className="w-full mt-6">
          <thead>
            <tr className="border-b border-black">
              <th></th>
              <th className="text-left pb-4">Username</th>
              <th className="text-left pb-4">Wins</th>
              <th className="text-left pb-4">Losses</th>
              <th className="text-left pb-4">Total Games</th>
              <th className="text-left pb-4">Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData?.leaderboard?.map((user: any, index: number) => (
              <tr className="border-b border-black" key={index}>
                <td className="p-2 text-right text-xl font-bold">{index + 1}</td>
                <td className="p-2 text-sm">@{user.username}</td>
                <td className="p-2">{user.stats.wins}</td>
                <td className="p-2">{user.stats.losses}</td>
                <td className="p-2">{user.stats.total}</td>
                <td className="p-2">{user.stats.percentage}%</td>
              </tr>
            ))}
            {(session && leaderboardData?.user?.position > 10 ) && (
              <>
                <tr>
                  <td className="h-8">
                    <div className="border-r-4 h-full border-dotted border-black mr-4 mt-4" />
                  </td>
                </tr>
                <tr className="border-b border-black text-green-700">
                  <td className="px-2 pb-2 pt-4 text-right text-xl font-bold">{leaderboardData?.user?.position}</td>
                  <td className="px-2 pb-2 pt-4 text-sm">@{leaderboardData?.user?.username}</td>
                  <td className="px-2 pb-2 pt-4">{leaderboardData?.user?.stats.wins}</td>
                  <td className="px-2 pb-2 pt-4">{leaderboardData?.user?.stats.losses}</td>
                  <td className="px-2 pb-2 pt-4">{leaderboardData?.user?.stats.total}</td>
                  <td className="px-2 pb-2 pt-4">{leaderboardData?.user?.stats.percentage}%</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default LeaderboardPage