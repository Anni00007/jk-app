import { PermissionEnum, PrismaClient, RoleEnum } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    await prisma.permission.createMany({
      data: [
        { name: PermissionEnum.CREATE, description: 'Create' },
        { name: PermissionEnum.READ, description: 'Read' },
        { name: PermissionEnum.UPDATE, description: 'Update' },
        { name: PermissionEnum.DELETE, description: 'Delete' },
      ],
    });

    const permissions = await prisma.permission.findMany({
      where: {
        name: {
          in: [
            PermissionEnum.CREATE,
            PermissionEnum.READ,
            PermissionEnum.UPDATE,
            PermissionEnum.DELETE,
          ],
        },
      },
    });

    await prisma.role.createMany({
      data: [
        { name: RoleEnum.ADMIN },
        { name: RoleEnum.EDITOR },
        { name: RoleEnum.VIEWER },
      ],
    });

    const adminRole = await prisma.role.findFirst({
      where: { name: RoleEnum.ADMIN },
    });

    if (adminRole) {
      await prisma.role.update({
        where: { id: adminRole.id },
        data: {
          permissions: {
            connect: permissions.map((perm) => ({ id: perm.id })),
          },
        },
      });
    } else {
      console.error('Admin role not found');
    }

    const user = await prisma.users.create({
      data: {
        firstName: 'adminUser',
        lastName: 'adminUser',
        email: 'admin@xyz.com',
        password: 'adminPassword',
        role: {
          connect: {
            id: adminRole?.id,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
