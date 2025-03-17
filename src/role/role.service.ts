import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateRoleDto, UpdateRoleParamDto } from './role.dto';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);
  constructor(private prismaService: PrismaService) {}

  async getRoles() {
    try {
      const role = await this.prismaService.role.findMany();

      if (role.length === 0) {
        throw new NotFoundException('Roles does not exist');
      }

      return role;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateRole(
    updateRoleParamDto: UpdateRoleParamDto,
    updateRoleDto: UpdateRoleDto,
  ) {
    try {
      const isRoleExist = await this.prismaService.role.findUnique({
        where: { id: updateRoleParamDto.id },
      });

      if (!isRoleExist) {
        throw new NotFoundException('Role does not exist');
      }

      const isAllPermissionsExist =
        await this.prismaService.permission.findMany({
          where: {
            id: {
              in: updateRoleDto.permissionIds,
            },
          },
        });

      if (isAllPermissionsExist.length !== updateRoleDto.permissionIds.length) {
        throw new NotFoundException('Some Permissions does not exist');
      }

      const updatedRole = await this.prismaService.role.update({
        where: { id: updateRoleParamDto.id },
        data: {
          permissions: {
            set: updateRoleDto.permissionIds.map((permissionId) => ({
              id: permissionId,
            })),
          },
        },
      });

      return updatedRole;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteRole(updateRoleParamDto: UpdateRoleParamDto) {
    try {
      const isRoleExist = await this.prismaService.role.findUnique({
        where: { id: updateRoleParamDto.id },
      });

      if (!isRoleExist) {
        throw new NotFoundException('Role does not exist');
      }

      const deletedRole = await this.prismaService.role.delete({
        where: { id: updateRoleParamDto.id },
      });
      return deletedRole;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
