import { useContext } from 'react'
import { AuthContext, useAuthContext } from '@/contexts/AuthContext'

export const useAuth = () => {
  return useAuthContext()
}
