import { Payload } from 'payload'
import type { Resident } from './payload-types'

type UserRole = 'admin' | 'caregiver' | 'kitchen'
type MealType = 'breakfast' | 'lunch' | 'dinner'
type OrderStatus = 'pending' | 'prepared'
interface ResidentDoc {
  id: number
  name: string
}

// German-inspired names
const firstNames = [
  'Anna',
  'Maria',
  'Elisabeth',
  'Hanna',
  'Sophie',
  'Karl',
  'Hans',
  'Peter',
  'Thomas',
  'Michael',
  'Wolfgang',
  'Josef',
]
const lastNames = [
  'Müller',
  'Schmidt',
  'Schneider',
  'Fischer',
  'Weber',
  'Meyer',
  'Wagner',
  'Becker',
  'Schulz',
  'Hoffmann',
  'Keller',
  'Huber',
]
const stations = ['Nord', 'Süd', 'Ost', 'West']
const dietaryNotes = [
  '',
  'Diabetiker',
  'Laktoseintoleranz',
  'Glutenunverträglichkeit',
  'Vegetarisch',
  'Vegan',
  'Nussallergie',
  'Kein Schweinefleisch',
  'Weichkost',
]

export const seedData = async (payload: Payload): Promise<void> => {
  // check if users already exist
  const createUserIfNotExists = async (email: string, password: string, role: UserRole) => {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'users',
        data: { email, password, role },
        overrideAccess: true,
      })
      console.log(`✅ Created user: ${email}`)
    } else {
      console.log(`⏭️ User already exists: ${email}`)
    }
  }

  await createUserIfNotExists('admin@example.com', 'test', 'admin')
  await createUserIfNotExists('caregiver@example.com', 'test', 'caregiver')
  await createUserIfNotExists('kitchen@example.com', 'test', 'kitchen')

  // create residents on init

  const existingResidents = await payload.find({
    collection: 'residents',
    limit: 1,
    overrideAccess: true,
  })

  if (existingResidents.totalDocs > 0) {
    console.log('⏭️ Residents already exist — skipping')
    return
  }

  const residents = []
  const total = 18

  for (let i = 0; i < total; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const room = String(100 + i + 1) // "101", "102", ...
    const table = Math.floor(Math.random() * 6) + 1 // tables 1–6
    const station = stations[Math.floor(Math.random() * stations.length)]
    const dietaryRestrictions =
      Math.random() > 0.7 ? dietaryNotes[Math.floor(Math.random() * dietaryNotes.length)] : ''
    const highCalorie = Math.random() > 0.8
    const aversions = Math.random() > 0.85 ? 'Keine Tomaten, kein Fisch' : ''
    const otherNotes = Math.random() > 0.9 ? 'Isst langsam' : ''

    residents.push({
      name: `${firstName} ${lastName}`,
      room,
      table,
      station,
      dietaryRestrictions,
      highCalorie,
      aversions,
      otherNotes,
    })
  }

  for (const resident of residents) {
    await payload.create({
      collection: 'residents',
      data: resident,
      overrideAccess: true,
    })
  }

  console.log(`✅ Created ${residents.length} random residents`)

  // fetch resident docs (with IDs)

  const allResidents = await payload.find({
    collection: 'residents',
    limit: 100,
    overrideAccess: true,
  })
  const residentDocs = allResidents.docs as ResidentDoc[]

  if (residentDocs.length === 0) return

  // create meal orders on init
  const ordersExist = await payload.find({
    collection: 'mealOrders',
    limit: 1,
    overrideAccess: true,
  })

  if (ordersExist.totalDocs > 0) return

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const dates = [today, yesterday]

  for (let i = 0; i < 30; i++) {
    const resident = residentDocs[Math.floor(Math.random() * residentDocs.length)]
    const date = dates[Math.floor(Math.random() * dates.length)]
    const mealType = (['breakfast', 'lunch', 'dinner'] as const)[Math.floor(Math.random() * 3)]
    const status = (Math.random() > 0.6 ? 'prepared' : 'pending') as OrderStatus

    let options = {}
    if (mealType === 'breakfast') {
      options = {
        accordingToPlan: Math.random() > 0.5,
        breadRoll: Math.random() > 0.6 ? 1 : 0,
        coffee: true,
      }
    } else if (mealType === 'lunch') {
      options = {
        portionSize: (['small', 'large', 'vegetarian'] as const)[Math.floor(Math.random() * 3)],
        soup: true,
      }
    } else {
      options = {
        accordingToPlan: true,
        greyBread: 1,
        tea: true,
      }
    }

    await payload.create({
      collection: 'mealOrders',
      data: {
        resident: resident.id,
        date,
        mealType,
        status,
        [`${mealType}Options`]: options,
      },
      overrideAccess: true,
    })

    console.log('✅ Successfully created 30 meal orders')
  }
}
