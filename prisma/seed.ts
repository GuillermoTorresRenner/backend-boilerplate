import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Crear el rol admin primero
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' },
  });

  // Crear el usuario con el roleId del rol admin creado
  await prisma.users.upsert({
    where: { email: 'guillermo.torres@lanek.cl' },
    update: {},
    create: {
      email: 'guillermo.torres@lanek.cl',
      password: '$2b$10$t7QlEELGNESkO27JBeilTeu3uIetDo15aY9SFC4EK.XWmJJLdKK7G',
      name: 'Guillermo',
      surname: 'Torres',
      roleId: adminRole.id, // Se asigna automáticamente el ID correcto del rol creado
    },
  });

  console.log('Seed data created successfully!');
  console.log('Admin role ID:', adminRole.id);
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
