import { Payload } from 'payload'
import { User } from './payload-types'

export const seed = async (payload: Payload): Promise<void> => {
  // create an admin user directly on init
  await payload.create<any, User>({
    collection: 'users',
    data: {
      email: 'admin@example.com',
      password: 'test',
      roles: ['admin'],
    },
  })

  // create an caregiver user directly on init
  await payload.create<any, User>({
    collection: 'users',
    data: {
      email: 'caregiver@example.com',
      password: 'test',
      roles: ['caregiver'],
    },
  })

  // create an kitchen user directly on init
  await payload.create<any, User>({
    collection: 'users',
    data: {
      email: 'kitchen@example.com',
      password: 'test',
      roles: ['kitchen'],
    },
  })
}
