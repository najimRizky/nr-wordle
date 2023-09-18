"use client"

import axios from "axios"
import { useContext, useEffect, useState } from "react"
import moment from "moment";
import Flag from "@/components/modules/Flag";
import UserForm from "@/components/modules/UserForm";
import Spinner from "@/components/modules/Spinner";
import { UserContext } from "@/context/UserContextProvider";

const ProfilePage = () => {
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

  if (loading) return <Spinner />
  return (
    <div className="container mt-8">
      <div className="grid sm:grid-cols-2 gap-8">
        <div className="grid gap-y-6" >
          <div className="flex justify-between">
            <h1 className="text-xl border-b-2 border-black w-fit">PROFILE</h1>
            {profileData && <UserForm data={profileData?.user} onSuccess={handleSuccess} />}
          </div>
          <div>
            <h2 className="font-bold text-sm">Username</h2>
            <p>{profileData?.user?.username}</p>
          </div>
          <div>
            <h2 className="font-bold text-sm">Email</h2>
            <p>{profileData?.user?.email}</p>
          </div>
          <div>
            <h2 className="font-bold text-sm">Country</h2>
            <Flag countryCode={profileData?.user?.country} />
          </div>
          <div>
            <h2 className="font-bold text-sm">Joined</h2>
            {moment(profileData?.createdAt).format('MMM, Do YYYY')}
          </div>
        </div>
        <div >
          <h1 className="text-xl border-b-2 border-black w-fit">STATISTIC</h1>
          <div className="flex justify-between mt-6">
            <div>
              <p className="text-xl">{profileData?.stats?.total}</p>
              <h2 className="font-bold text-lg">Total Games</h2>
            </div>
            <div className="text-right">
              <p className="text-xl">{((profileData?.stats?.percentage) * 100).toFixed(2)}%</p>
              <h2 className="font-bold text-lg">Win Rate</h2>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <div>
              <p className="text-xl">{profileData?.stats?.wins}</p>
              <h2 className="font-bold text-lg">Wins</h2>
            </div>
            <div className="text-right">
              <p className="text-xl">{profileData?.stats?.losses}</p>
              <h2 className="font-bold text-lg">Losses</h2>
            </div>
          </div>
        </div>
      </div>

      <div >
        <h2 className="text-xl border-b-2 border-black w-fit mx-auto mt-12">HISTORY</h2>
        <div className="my-12"></div>
      </div>
    </div>
  )
}

export default ProfilePage