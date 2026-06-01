export const PASSWORD = 'secret_sauce'

export interface User {
  username: string
  description: string
  expected: 'success' | 'locked_out'
}

export const VALID_USERS: User[] = [
  { username: 'standard_user', description: 'standard user', expected: 'success' },
  { username: 'problem_user', description: 'problem user', expected: 'success' },
  { username: 'performance_glitch_user', description: 'performance glitch user', expected: 'success' },
  { username: 'error_user', description: 'error user', expected: 'success' },
  { username: 'visual_user', description: 'visual user', expected: 'success' },
]

export const LOCKED_OUT_USER: User = {
  username: 'locked_out_user',
  description: 'locked out user',
  expected: 'locked_out',
}

export const ALL_USERS: User[] = [...VALID_USERS, LOCKED_OUT_USER]

export const ERROR_MESSAGES = {
  LOCKED_OUT: 'Sorry, this user has been locked out.',
  WRONG_CREDENTIALS: 'Username and password do not match any user in this service',
  USERNAME_REQUIRED: 'Username is required',
  PASSWORD_REQUIRED: 'Password is required',
} as const
