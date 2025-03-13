import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GetPermissionByIdParamDto } from './permission.dto';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);
  constructor(private prismaService: PrismaService) {}

  async getAllPermissions() {
    try {
      const permissions = await this.prismaService.permission.findMany();

      if (permissions.length === 0) {
        throw new NotFoundException('Permissions does not exist');
      }

      return permissions;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getPermissionById(
    getPermissionByIdParamDto: GetPermissionByIdParamDto,
  ) {
    try {
      const permission = await this.prismaService.permission.findUnique({
        where: { id: getPermissionByIdParamDto.id },
      });

      if (!permission) {
        throw new NotFoundException('Permission does not exist');
      }

      return permission;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deletePermission(getPermissionByIdParamDto: GetPermissionByIdParamDto) {
    try {
      const isPermissionExist = await this.prismaService.permission.findUnique({
        where: { id: getPermissionByIdParamDto.id },
      });

      if (!isPermissionExist) {
        throw new NotFoundException('Permission does not exist');
      }

      const deletedPermission = await this.prismaService.permission.delete({
        where: { id: getPermissionByIdParamDto.id },
      });
      return deletedPermission;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
