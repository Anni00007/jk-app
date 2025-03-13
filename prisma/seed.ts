import { PermissionEnum, PrismaClient, RoleEnum } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function seed() {
  try {
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

    if (permissions.length === 0) {
      await prisma.permission.createMany({
        data: [
          { name: PermissionEnum.CREATE, description: 'Create' },
          { name: PermissionEnum.READ, description: 'Read' },
          { name: PermissionEnum.UPDATE, description: 'Update' },
          { name: PermissionEnum.DELETE, description: 'Delete' },
        ],
      });
    }

    const roles = await prisma.role.findMany({
      where: {
        name: {
          in: [RoleEnum.ADMIN, RoleEnum.EDITOR, RoleEnum.VIEWER],
        },
      },
    });

    const existingRoleNames = roles.map((role) => role.name);

    if (!existingRoleNames.includes(RoleEnum.ADMIN)) {
      await prisma.role.create({
        data: { name: RoleEnum.ADMIN },
      });
    }
    if (!existingRoleNames.includes(RoleEnum.EDITOR)) {
      await prisma.role.create({
        data: { name: RoleEnum.EDITOR },
      });
    }
    if (!existingRoleNames.includes(RoleEnum.VIEWER)) {
      await prisma.role.create({
        data: { name: RoleEnum.VIEWER },
      });
    }

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
        password: await argon.hash('adminPassword'),
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
