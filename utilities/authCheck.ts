import { User } from 'firebase/auth'

export const isAdmin = async (user: User): Promise<boolean> => {
  const token = await user.getIdTokenResult()
  return token.claims['role'] === 'admin'
}
