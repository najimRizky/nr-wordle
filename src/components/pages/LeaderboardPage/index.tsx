"use client"

import Flag from "@/components/modules/Flag"
import { UserContext } from "@/context/UserContextProvider"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useContext, useEffect, useState } from "react"

const LeaderboardPage = () => {
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
            <tr className="border-b border-slate-400">
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
              <tr
                className={`border-b border-slate-400 
                ${session && user.username === userContext.username ? 'bg-red-200 font-bold' : ''}`}
                key={index}
              >
                <td className="p-2 text-right text-xl font-bold">{index + 1}</td>
                <td className="p-2 text-sm flex gap-x-3"><Flag countryCode={user?.country} /> @{user.username}</td>
                <td className="p-2">{user.stats.wins}</td>
                <td className="p-2">{user.stats.losses}</td>
                <td className="p-2">{user.stats.total}</td>
                <td className="p-2">{user.stats.percentage}%</td>
              </tr>
            ))}
            {(session && leaderboardData?.user?.position > 10) && (
              <>
                <tr>
                  <td className="h-10 py-2">
                    <div className="border-r-4 h-full border-dotted border-slate-500 mr-4" />
                  </td>
                </tr>
                <tr className="border-b border-slate-400 bg-red-200 font-bold">
                  <td className="p-2 text-right text-xl font-bold">{leaderboardData?.user?.position}</td>
                  <td className="p-2 text-sm">@{leaderboardData?.user?.username}</td>
                  <td className="p-2">{leaderboardData?.user?.stats.wins}</td>
                  <td className="p-2">{leaderboardData?.user?.stats.losses}</td>
                  <td className="p-2">{leaderboardData?.user?.stats.total}</td>
                  <td className="p-2">{leaderboardData?.user?.stats.percentage}%</td>
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