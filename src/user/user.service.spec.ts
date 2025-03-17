import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    users: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
    },
  };

  const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRole = {
    id: 1,
    name: 'ADMIN',
    permissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const expectedUsers = [
        {
          id: mockUser.id,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email,
        },
      ];
      mockPrismaService.users.findMany.mockResolvedValue(expectedUsers);

      const result = await userService.getAllUsers();

      expect(result).toEqual(expectedUsers);
      expect(mockPrismaService.users.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const expectedUser = {
        id: mockUser.id,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
      };
      mockPrismaService.users.findUnique.mockResolvedValue(expectedUser);

      const result = await userService.getUserById({ id: 1 });

      expect(result).toEqual(expectedUser);
      expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });
    });
  });

  describe('updateUserRole', () => {
    it('should update user role', async () => {
      const updatedUser = {
        id: mockUser.id,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
      };
      mockPrismaService.role.findUnique.mockResolvedValue(mockRole);
      mockPrismaService.users.update.mockResolvedValue(updatedUser);

      const result = await userService.updateUserRole({ id: 1 }, { roleId: 1 });

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.role.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.users.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { roleId: 1 },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });
    });

    it('should throw NotFoundException if role not found', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue(null);

      await expect(
        userService.updateUserRole({ id: 1 }, { roleId: 999 }),
      ).rejects.toThrow(new NotFoundException('Role with ID 999 not found'));
    });
  });

  describe('updateUser', () => {
    it('should update user details', async () => {
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
      };
      const updatedUser = {
        id: mockUser.id,
        firstName: 'Jane',
        lastName: 'Smith',
        email: mockUser.email,
      };
      mockPrismaService.users.update.mockResolvedValue(updatedUser);

      const result = await userService.updateUser({ id: 1 }, updateData);

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.users.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      mockPrismaService.users.findFirst.mockResolvedValue(mockUser);
      mockPrismaService.users.delete.mockResolvedValue(mockUser);

      const result = await userService.deleteUser({ id: 1 });

      expect(result).toBe(true);
      expect(mockPrismaService.users.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.users.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.users.findFirst.mockResolvedValue(null);

      await expect(userService.deleteUser({ id: 999 })).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });
  });
});
