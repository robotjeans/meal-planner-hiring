import type { CollectionConfig } from 'payload'

export const Residents: CollectionConfig = {
  slug: 'residents',
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', label: 'Name', required: true },
    { name: 'room', type: 'text', label: 'Zimmer' },
    { name: 'table', type: 'number', label: 'Tisch' },
    { name: 'station', type: 'text', label: 'Station' },
    { name: 'dietaryRestrictions', type: 'textarea', label: 'Diätbeschränkungen' },
    { name: 'highCalorie', type: 'checkbox', label: 'Hoher Kaloriengehalt' },
    { name: 'aversions', type: 'textarea', label: 'Abneigungen' },
    { name: 'otherNotes', type: 'textarea', label: 'Sonstige Hinweise' },
  ],
}
