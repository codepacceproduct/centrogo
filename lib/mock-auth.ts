type MockAuthUser = {
  email: string
  name: string
}

const STORAGE_KEY = 'centrogo:mock-auth-user'

function readUser(): MockAuthUser | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as MockAuthUser
    if (!parsed?.email) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeUser(user: MockAuthUser): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function isMockAuthenticated(): boolean {
  return readUser() !== null
}

export function loginMockAuth(email: string): void {
  writeUser({
    email,
    name: email.split('@')[0] || 'Usuario',
  })
}

export function logoutMockAuth(): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}

export function getMockAuthUser(): MockAuthUser | null {
  return readUser()
}
