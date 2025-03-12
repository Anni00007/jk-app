import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async createRole() {}

  async getRoles() {}

  async updateRole() {}

  async deleteRole() {}
}
