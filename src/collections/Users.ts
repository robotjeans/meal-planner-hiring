import { isAdmin, isAdminFieldLevel } from '@/access/isAdmin'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'firstName',
      label: 'First name',
      type: 'text',
    },
    {
      name: 'lastName',
      label: 'Last name',
      type: 'text',
    },
    {
      name: 'role',
      label: 'Role',
      saveToJWT: true,
      type: 'select',
      hasMany: true,
      access: { create: isAdminFieldLevel, update: isAdminFieldLevel },
      defaultValue: 'caregiver',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Kitchen', value: 'kitchen' },
        { label: 'Caregiver', value: 'caregiver' },
      ],
    },
  ],
}
