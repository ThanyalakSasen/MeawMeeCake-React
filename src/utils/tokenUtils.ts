// NOTE: This is a MOCK token system for demonstration only.
// In production, tokens must be issued and verified by a backend server.
// Never sign or verify tokens on the client side in a real application.

const MOCK_SIGNATURE = 'meawmeecake-mock-sig-v1'

export interface TokenPayload {
  sub: string               // subject (username)
  role: string              // user role
  iat: number               // issued at (unix seconds)
  exp: number               // expires at (unix seconds)
  type: 'access' | 'refresh'
}

function encode(payload: TokenPayload): string {
  return btoa(JSON.stringify(payload)) + '.' + btoa(MOCK_SIGNATURE)
}

export function parseToken(token: string): TokenPayload | null {
  try {
    const dotIndex = token.lastIndexOf('.')
    if (dotIndex === -1) return null
    const sig = atob(token.slice(dotIndex + 1))
    if (sig !== MOCK_SIGNATURE) return null
    return JSON.parse(atob(token.slice(0, dotIndex))) as TokenPayload
  } catch {
    return null
  }
}

export function isTokenValid(token: string): boolean {
  const payload = parseToken(token)
  if (!payload) return false
  return payload.exp > Math.floor(Date.now() / 1000)
}

export function generateAccessToken(username: string, role: string): string {
  const now = Math.floor(Date.now() / 1000)
  return encode({
    sub: username,
    role,
    iat: now,
    exp: now + 15 * 60, // 15 minutes
    type: 'access',
  })
}

export function generateRefreshToken(username: string, role: string): string {
  const now = Math.floor(Date.now() / 1000)
  return encode({
    sub: username,
    role,
    iat: now,
    exp: now + 7 * 24 * 60 * 60, // 7 days
    type: 'refresh',
  })
}

export function tryRefreshAccessToken(refreshToken: string): string | null {
  const payload = parseToken(refreshToken)
  if (!payload || payload.type !== 'refresh') return null
  if (payload.exp <= Math.floor(Date.now() / 1000)) return null
  return generateAccessToken(payload.sub, payload.role)
}

export function formatCountdown(expUnix: number): string {
  const secs = Math.max(0, expUnix - Math.floor(Date.now() / 1000))
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}m ${s.toString().padStart(2, '0')}s`
}
