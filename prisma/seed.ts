import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function getOrCreateVenue(name: string, city: string) {
  const existing = await prisma.venue.findFirst({ where: { name, city } });
  if (existing) return existing;
  return prisma.venue.create({ data: { name, city } });
}

async function getOrCreateTeam(name: string, sportId: number) {
  const existing = await prisma.team.findFirst({ where: { name, sportId } });
  if (existing) return existing;
  return prisma.team.create({ data: { name, sportId } });
}

async function main() {
  console.log('🚀 Starting database seeding...');

  const football = await prisma.sport.upsert({
    where: { name: 'Football' },
    update: {},
    create: { name: 'Football' },
  });

  const iceHockey = await prisma.sport.upsert({
    where: { name: 'Ice Hockey' },
    update: {},
    create: { name: 'Ice Hockey' },
  });

  const redBullArena = await getOrCreateVenue('Red Bull Arena', 'Salzburg');
  const merkurArena = await getOrCreateVenue('Merkur-Arena', 'Graz');
  const eisArena = await getOrCreateVenue(
    'Keine Sorgen EisArena',
    'Klagenfurt',
  );

  const salzburg = await getOrCreateTeam('FC Red Bull Salzburg', football.id);
  const sturm = await getOrCreateTeam('SK Sturm Graz', football.id);
  const rapid = await getOrCreateTeam('SK Rapid Wien', football.id);
  const kac = await getOrCreateTeam('KAC', iceHockey.id);
  const capitals = await getOrCreateTeam('Capitals', iceHockey.id);

  await prisma.event.deleteMany();

  await prisma.event.createMany({
    data: [
      {
        event_date: new Date('2019-07-18'),
        event_time: '18:30',
        description: 'Opening match of the season',
        sportId: football.id,
        venueId: redBullArena.id,
        homeTeamId: salzburg.id,
        awayTeamId: sturm.id,
      },
      {
        event_date: new Date('2019-07-19'),
        event_time: '20:45',
        description: 'Friday night fever',
        sportId: football.id,
        venueId: merkurArena.id,
        homeTeamId: sturm.id,
        awayTeamId: rapid.id,
      },
      {
        event_date: new Date('2019-10-23'),
        event_time: '09:45',
        description: 'Ice Hockey derby',
        sportId: iceHockey.id,
        venueId: eisArena.id,
        homeTeamId: kac.id,
        awayTeamId: capitals.id,
      },
    ],
  });

  console.log('✅ Seeding complete! Database is ready.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
