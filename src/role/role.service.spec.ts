import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';

describe('RoleService', () => {
  let roleService: RoleService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    role: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    permission: {
      findMany: jest.fn(),
    },
  };

  const mockRole = {
    id: 1,
    name: RoleEnum.VIEWER,
    permissions: [
      { id: 1, name: 'read' },
      { id: 2, name: 'write' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    roleService = module.get<RoleService>(RoleService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('getRoles', () => {
    it('should return all roles', async () => {
      mockPrismaService.role.findMany.mockResolvedValue([mockRole]);

      const result = await roleService.getRoles();

      expect(result).toEqual([mockRole]);
      expect(mockPrismaService.role.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no roles exist', async () => {
      mockPrismaService.role.findMany.mockResolvedValue([]);

      await expect(roleService.getRoles()).rejects.toThrow(
        new NotFoundException('Roles does not exist'),
      );
    });
  });

  describe('updateRole', () => {
    const updateRoleParamDto = { id: 1 };
    const updateRoleDto = { permissionIds: [1, 2] };

    it('should update role permissions', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue(mockRole);
      mockPrismaService.permission.findMany.mockResolvedValue([
        { id: 1, name: 'read' },
        { id: 2, name: 'write' },
      ]);
      mockPrismaService.role.update.mockResolvedValue({
        ...mockRole,
        permissions: updateRoleDto.permissionIds.map((id) => ({ id })),
      });

      const result = await roleService.updateRole(
        updateRoleParamDto,
        updateRoleDto,
      );

      expect(result).toBeDefined();
      expect(mockPrismaService.role.update).toHaveBeenCalledWith({
        where: { id: updateRoleParamDto.id },
        data: {
          permissions: {
            set: updateRoleDto.permissionIds.map((permissionId) => ({
              id: permissionId,
            })),
          },
        },
      });
    });

    it('should throw NotFoundException if role does not exist', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue(null);

      await expect(
        roleService.updateRole(updateRoleParamDto, updateRoleDto),
      ).rejects.toThrow(new NotFoundException('Role does not exist'));
    });

    it('should throw NotFoundException if any permission does not exist', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue(mockRole);
      mockPrismaService.permission.findMany.mockResolvedValue([
        { id: 1, name: 'read' },
      ]);

      await expect(
        roleService.updateRole(updateRoleParamDto, updateRoleDto),
      ).rejects.toThrow(
        new NotFoundException('Some Permissions does not exist'),
      );
    });
  });

  describe('deleteRole', () => {
    it('should delete a role', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue(mockRole);
      mockPrismaService.role.delete.mockResolvedValue(mockRole);

      const result = await roleService.deleteRole({ id: 1 });

      expect(result).toEqual(mockRole);
      expect(mockPrismaService.role.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if role does not exist', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue(null);

      await expect(roleService.deleteRole({ id: 999 })).rejects.toThrow(
        new NotFoundException('Role does not exist'),
      );
    });
  });
});
