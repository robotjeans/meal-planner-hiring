import { Payload } from 'payload'

type UserRole = 'admin' | 'caregiver' | 'kitchen'

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
}
