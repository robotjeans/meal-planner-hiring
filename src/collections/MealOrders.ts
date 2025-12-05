// collections/MealOrders.ts
import type { CollectionConfig } from 'payload'

export const MealOrders: CollectionConfig = {
  slug: 'mealOrders',
  timestamps: true,
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      if (user.role === 'caregiver') return { createdBy: { equals: user.id } }
      if (user.role === 'kitchen') return true
      return false
    },
    create: ({ req: { user } }) => user?.role === 'caregiver',
    update: ({ req: { user } }) => user?.role === 'kitchen' || user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'resident',
      type: 'relationship',
      relationTo: 'residents',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'mealType',
      type: 'select',
      options: [
        { label: 'Frühstück', value: 'breakfast' },
        { label: 'Mittagessen', value: 'lunch' },
        { label: 'Abendessen', value: 'dinner' },
      ],
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Ausstehend', value: 'pending' },
        { label: 'Zubereitet', value: 'prepared' },
      ],
      defaultValue: 'pending',
      required: true,
    },

    // breakfast options
    {
      name: 'breakfastOptions',
      type: 'group',
      admin: { condition: (_, { mealType }) => mealType === 'breakfast' },
      fields: [
        { name: 'accordingToPlan', type: 'checkbox', label: 'Frühstück lt. Plan' },
        { name: 'breadRoll', type: 'number', label: 'Brötchen', min: 0 },
        { name: 'wholeGrainRoll', type: 'number', label: 'Vollkornbrötchen', min: 0 },
        { name: 'greyBread', type: 'number', label: 'Graubrot', min: 0 },
        { name: 'sliced', type: 'checkbox', label: 'geschnitten' },
        { name: 'spread', type: 'checkbox', label: 'geschmiert' },
        { name: 'butter', type: 'checkbox', label: 'Butter' },
        { name: 'jam', type: 'checkbox', label: 'Konfitüre' },
        { name: 'coffee', type: 'checkbox', label: 'Kaffee' },
        { name: 'tea', type: 'checkbox', label: 'Tee' },
      ],
    },

    // lunch options
    {
      name: 'lunchOptions',
      type: 'group',
      admin: { condition: (_, { mealType }) => mealType === 'lunch' },
      fields: [
        {
          name: 'portionSize',
          type: 'select',
          options: [
            { label: 'Kleine Portion', value: 'small' },
            { label: 'Große Portion', value: 'large' },
            { label: 'Vollwertkost vegetarisch', value: 'vegetarian' },
          ],
        },
        { name: 'soup', type: 'checkbox', label: 'Suppe' },
        { name: 'dessert', type: 'checkbox', label: 'Dessert' },
        { name: 'pureedFood', type: 'checkbox', label: 'passierte Kost' },
        { name: 'pureedMeat', type: 'checkbox', label: 'passiertes Fleisch' },
        { name: 'slicedMeat', type: 'checkbox', label: 'geschnittenes Fleisch' },
        { name: 'mashedPotatoes', type: 'checkbox', label: 'Kartoffelbrei' },
        { name: 'noFish', type: 'checkbox', label: 'ohne Fisch' },
        { name: 'fingerFood', type: 'checkbox', label: 'Fingerfood' },
        { name: 'onlySweet', type: 'checkbox', label: 'nur süß' },
      ],
    },

    // dinner options
    {
      name: 'dinnerOptions',
      type: 'group',
      admin: { condition: (_, { mealType }) => mealType === 'dinner' },
      fields: [
        { name: 'accordingToPlan', type: 'checkbox', label: 'Abendessen lt. Plan' },
        { name: 'greyBread', type: 'number', label: 'Graubrot', min: 0 },
        { name: 'wholeGrainBread', type: 'number', label: 'Vollkornbrot', min: 0 },
        { name: 'whiteBread', type: 'number', label: 'Weißbrot', min: 0 },
        { name: 'crispbread', type: 'number', label: 'Knäckebrot', min: 0 },
        { name: 'spread', type: 'checkbox', label: 'geschmiert' },
        { name: 'sliced', type: 'checkbox', label: 'geschnitten' },
        { name: 'butter', type: 'checkbox', label: 'Butter' },
        { name: 'margarine', type: 'checkbox', label: 'Margarine' },
        { name: 'soup', type: 'checkbox', label: 'Suppe' },
        { name: 'puree', type: 'checkbox', label: 'Brei' },
        { name: 'noFish', type: 'checkbox', label: 'ohne Fisch' },
        { name: 'tea', type: 'checkbox', label: 'Tee' },
        { name: 'cocoa', type: 'checkbox', label: 'Kakao' },
        { name: 'hotMilk', type: 'checkbox', label: 'Milch heiß' },
        { name: 'coldMilk', type: 'checkbox', label: 'Milch kalt' },
        { name: 'sugar', type: 'checkbox', label: 'Zucker' },
        { name: 'sweetener', type: 'checkbox', label: 'Süßstoff' },
      ],
    },
  ],
}
