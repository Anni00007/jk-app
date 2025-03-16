import { Injectable, NotFoundException } from '@nestjs/common';
import {
  UpdateUserBodyDto,
  UpdateUserRoleBodyDto,
  UpdateUserRoleParamDto,
} from './user.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllUsers() {
    return await this.prismaService.users.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  }
  async getUserById(updateUserRoleParamDto: UpdateUserRoleParamDto) {
    const { id } = updateUserRoleParamDto;
    return await this.prismaService.users.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  }

  async updateUserRole(
    updateUserRoleParamDto: UpdateUserRoleParamDto,
    updateUserRoleBodyDto: UpdateUserRoleBodyDto,
  ) {
    const { id } = updateUserRoleParamDto;
    const { roleId } = updateUserRoleBodyDto;

    const role = await this.prismaService.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return await this.prismaService.users.update({
      where: { id },
      data: { roleId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  }

  async updateUser(
    updateUserRoleParamDto: UpdateUserRoleParamDto,
    updateUserBodyDto: UpdateUserBodyDto,
  ) {
    const { id } = updateUserRoleParamDto;

    return await this.prismaService.users.update({
      where: { id },
      data: updateUserBodyDto,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  }

  async deleteUser(updateUserRoleParamDto: UpdateUserRoleParamDto) {
    const { id } = updateUserRoleParamDto;

    const userExist = await this.prismaService.users.findFirst({
      where: { id },
    });

    if (!userExist) throw new NotFoundException('User not found');

    const user = await this.prismaService.users.delete({
      where: { id },
    });

    if (user) return true;
  }
}
