import { getLocalStorage, removeLocalStorage, setLocalStorage } from '@/helper/localStorage';
import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { IUserContext } from './interface';

export const UserContext = createContext<IUserContext>({})

const UserContextProvider = ({ children, session }: any) => {
  const [user, setUser] = useState<any>()
  const [stats, setStats] = useState<any>()

  const initialUser = async () => {
    try {
      const stats = getLocalStorage('stats')
      const user = await axios.post('/api/user', {
        ...stats
      })

      const userData = await user.data.data.user
      updateUser(userData)

      const statsData = await user.data.data.stats
      updateStats(statsData)
      
      setLocalStorage('isInitialized', true)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (session) {
      const isInitialized = getLocalStorage('isInitialized')
      if (!isInitialized) {
        initialUser()
      }
    } else {
      removeLocalStorage('isInitialized')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  useEffect(() => {
    const user = getLocalStorage('user')
    if (user) {
      setUser(user)
    }
    const stats = getLocalStorage('stats')
    if (stats) {
      setStats(stats)
    }
  }, [])

  const updateUser = (user: any) => {
    setUser(user)
    setLocalStorage('user', user)
  }

  const updateStats = (stats: any) => {
    setStats(stats)
    setLocalStorage('stats', stats)
  }

  const contextValue = { user, stats, updateUser, updateStats }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
