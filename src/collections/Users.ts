import { isAdmin, isAdminFieldLevel } from '@/access/isAdmin'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Caregiver', value: 'caregiver' },
        { label: 'Kitchen', value: 'kitchen' },
      ],
      required: true,
      access: {
        read: () => true,
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}
