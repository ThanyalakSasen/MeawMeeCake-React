interface MockUser {
  username: string
  password: string
  role: string
}

const MOCK_USERS: MockUser[] = [
  { username: 'admin',  password: 'password',  role: 'Administrator' },
  { username: 'user',   password: 'user123',   role: 'User'          },
  { username: 'meaw',   password: 'meaw2026',  role: 'Manager'       },
]

export interface AuthenticatedUser {
  username: string
  role: string
}

export function authenticateUser(username: string, password: string): AuthenticatedUser | null {
  const found = MOCK_USERS.find(
    (u) => u.username === username && u.password === password,
  )
  if (!found) return null
  return { username: found.username, role: found.role }
}

// Credentials intentionally exposed for demo/login hint only
export const MOCK_USER_HINTS = MOCK_USERS.map(({ username, password, role }) => ({
  username,
  password,
  role,
}))
