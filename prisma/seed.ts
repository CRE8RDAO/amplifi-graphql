import { PrismaClient, Prisma } from '@prisma/client';
import { seedReferrals } from './data/referral';

const prisma = new PrismaClient();

const userData: Prisma.CampaignCreateInput[] = [];

async function main() {
  console.log(`Start seeding ...`);
  await seedReferrals(prisma);
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
