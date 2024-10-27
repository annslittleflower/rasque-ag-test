import { ReactNode, createContext, useContext, useState } from 'react';
import type { User } from '@/common/types/User';


type AuthContext = {
  currentUser: User | undefined,
  setCurrentUser: (user: User) => void
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

const AuthProvider = ({ children }: {children: ReactNode}) => {
  const [user, setUser] = useState<AuthContext['currentUser']>(undefined);

  const setCurrentUser = (user: User) => {
    setUser(user)
  };

  return (
    <AuthContext.Provider value={{ currentUser: user, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    console.warn('useAuthContext must be within AuthProvider')
    throw new Error("useAuthContext must be within AuthProvider")
  }
  return ctx;
};

export { AuthProvider, useAuthContext };