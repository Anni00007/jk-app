import { Test, TestingModule } from '@nestjs/testing';
import { PermissionService } from './permission.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Logger, NotFoundException } from '@nestjs/common';

describe('PermissionService', () => {
  let permissionService: PermissionService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    permission: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockPermission = {
    id: 1,
    name: 'read',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    permissionService = module.get<PermissionService>(PermissionService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    jest.clearAllMocks();
  });

  describe('getAllPermissions', () => {
    it('should return all permissions', async () => {
      mockPrismaService.permission.findMany.mockResolvedValue([mockPermission]);

      const result = await permissionService.getAllPermissions();

      expect(result).toEqual([mockPermission]);
      expect(mockPrismaService.permission.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no permissions exist', async () => {
      mockPrismaService.permission.findMany.mockResolvedValue([]);

      await expect(permissionService.getAllPermissions()).rejects.toThrow(
        new NotFoundException('Permissions does not exist'),
      );
    });
  });

  describe('getPermissionById', () => {
    it('should return a permission by id', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(mockPermission);

      const result = await permissionService.getPermissionById({ id: 1 });

      expect(result).toEqual(mockPermission);
      expect(mockPrismaService.permission.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if permission not found', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(null);

      await expect(
        permissionService.getPermissionById({ id: 999 }),
      ).rejects.toThrow(new NotFoundException('Permission does not exist'));
    });
  });

  describe('deletePermission', () => {
    it('should delete a permission', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(mockPermission);
      mockPrismaService.permission.delete.mockResolvedValue(mockPermission);

      const result = await permissionService.deletePermission({ id: 1 });

      expect(result).toEqual(mockPermission);
      expect(mockPrismaService.permission.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.permission.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if permission to delete not found', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(null);

      await expect(
        permissionService.deletePermission({ id: 999 }),
      ).rejects.toThrow(new NotFoundException('Permission does not exist'));
    });
  });
});
