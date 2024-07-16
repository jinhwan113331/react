import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete all existing records
  await prisma.user.deleteMany();

  // Create users
  const user1 = await prisma.user.create({
    data: {
      nickname: 'user1',
      password: 'password1',
      history: 'history1',
      puuid: 'puuid1',
      email: 'user1@example.com',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      nickname: 'user2',
      password: 'password2',
      history: 'history2',
      puuid: 'puuid2',
      email: 'user2@example.com',
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });