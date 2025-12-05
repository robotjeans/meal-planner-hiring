import { Access, FieldAccess } from 'payload'
import { User } from '@/payload-types'

export const isAdmin: Access<User> = ({ req: { user } }) => {
  return Boolean(user?.role?.includes('admin'))
}

export const isAdminFieldLevel: FieldAccess<{ id: string }, User> = ({ req: { user } }) => {
  return Boolean(user?.role?.includes('admin'))
}
