// scripts/seed-admin.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding admin user...');

  const username = 'admin';
  const password = 'admin123'; // Change this to your preferred password
  const name = 'Administrator';

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { username },
  });

  if (existingAdmin) {
    console.log('✅ Admin already exists:', username);
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin
  const admin = await prisma.admin.create({
    data: {
      username,
      password: hashedPassword,
      name,
    },
  });

  console.log('✅ Admin created successfully!');
  console.log('📧 Username:', username);
  console.log('🔑 Password:', password);
  console.log('⚠️  Please change this password in production!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });