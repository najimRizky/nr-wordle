"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import FlagsComponent from "country-flag-icons/react/3x2";
import moment from "moment";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState<any>()

  const Flags: any = FlagsComponent
  const Flag = Flags[profileData?.country]

  const getProfileData = async () => {
    try {
      const response = await axios.get('/api/user')
      setProfileData(response.data.data)
    } catch (error: any) {
      console.log(error)
    }
  }

  useEffect(() => {
    getProfileData()
  }, [])

  return (
    <div className="container mt-8">
      <div className="grid grid-cols-2">
        <div className="grid gap-y-6" >
          <h1 className="text-xl border-b-2 border-black w-fit">PROFILE</h1>
          <div>
            <h2 className="font-bold text-sm">Username</h2>
            <p>{profileData?.username}</p>
          </div>
          <div>
            <h2 className="font-bold text-sm">Email</h2>
            <p>{profileData?.email}</p>
          </div>
          <div>
            <h2 className="font-bold text-sm">Country</h2>
            {profileData?.country ? <Flag width={40} /> : <p>Not set</p>}
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
              <p className="text-xl">{profileData?.stats?.percentage}%</p>
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