import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Controller, Get, Patch } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { RoleService } from './role.service';

@ApiTags('Auth')
@Controller('auth')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Creates Role',
  })
  @Post()
  @UsePipes()
  async createRole() {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get roles',
  })
  @Get()
  @UsePipes()
  async getRoles() {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update role',
  })
  @Patch()
  @UsePipes()
  async updateRole() {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'delete role',
  })
  @Patch()
  @UsePipes()
  async deleteRole() {}
}
