import { getLocalStorage } from '@/helper/localStorage';
import { createContext, useEffect, useMemo, useState } from 'react';

interface IUserContext {
  user: any;
  setUser: any;
}

export const UserContext = createContext<IUserContext>({
  user: null,
  setUser: () => { },
});

const UserContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>()
  const contextValue = useMemo(() => ({ user, setUser }), [user]);

  useEffect(() => {
    const user = getLocalStorage('user')
    if (user) {
      setUser(user)
    }
  }, [])

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
