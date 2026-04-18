import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import {
  generateAccessToken,
  generateRefreshToken,
  tryRefreshAccessToken,
  parseToken,
  isTokenValid,
} from '../utils/tokenUtils'
import { authenticateUser } from '../utils/mockUsers'

const REFRESH_TOKEN_KEY = 'mmcake_refresh_token'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: string | null
  role: string | null
  accessToken: string | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const setSession = useCallback((token: string) => {
    const payload = parseToken(token)
    if (!payload) return
    setAccessToken(token)
    setUser(payload.sub)
    setRole(payload.role)
    setIsAuthenticated(true)
  }, [])

  const clearSession = useCallback(() => {
    setAccessToken(null)
    setUser(null)
    setRole(null)
    setIsAuthenticated(false)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }, [])

  // Restore session from refresh token on mount
  useEffect(() => {
    const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (storedRefresh && isTokenValid(storedRefresh)) {
      const newAccess = tryRefreshAccessToken(storedRefresh)
      if (newAccess) {
        setSession(newAccess)
      } else {
        localStorage.removeItem(REFRESH_TOKEN_KEY)
      }
    }
    setIsLoading(false)
  }, [setSession])

  // Schedule silent token refresh 2 minutes before access token expiry
  useEffect(() => {
    if (!accessToken) return
    const payload = parseToken(accessToken)
    if (!payload) return
    const now = Math.floor(Date.now() / 1000)
    const msUntilRefresh = Math.max(0, (payload.exp - now - 120) * 1000)

    const timer = setTimeout(() => {
      const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY)
      if (storedRefresh) {
        const newAccess = tryRefreshAccessToken(storedRefresh)
        if (newAccess) setSession(newAccess)
        else clearSession()
      } else {
        clearSession()
      }
    }, msUntilRefresh)

    return () => clearTimeout(timer)
  }, [accessToken, setSession, clearSession])

  const login = (username: string, password: string): boolean => {
    const authUser = authenticateUser(username, password)
    if (!authUser) return false
    const newAccess = generateAccessToken(authUser.username, authUser.role)
    const newRefresh = generateRefreshToken(authUser.username, authUser.role)
    localStorage.setItem(REFRESH_TOKEN_KEY, newRefresh)
    setSession(newAccess)
    return true
  }

  const logout = () => clearSession()

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, role, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
