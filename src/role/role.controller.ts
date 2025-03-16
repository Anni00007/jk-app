import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { RoleService } from './role.service';
import { ResponseService } from 'src/common/response/response.service';
import { JoiValidationPipe } from 'src/common/utils/joi-validation.interface';
import {
  UpdateRoleDto,
  UpdateRoleParamDto,
  updateRoleParamSchema,
  updateRoleSchema,
} from './role.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { RoleEnum } from '@prisma/client';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get roles',
  })
  @Get()
  @Roles(RoleEnum.ADMIN)
  async getRoles() {
    const roles = await this.roleService.getRoles();
    return ResponseService.buildResponse(roles);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update role',
  })
  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @UsePipes(new JoiValidationPipe(updateRoleParamSchema, 'param'))
  @UsePipes(new JoiValidationPipe(updateRoleSchema, 'body'))
  async updateRole(
    @Param() updateRoleParamDto: UpdateRoleParamDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const role = await this.roleService.updateRole(
      updateRoleParamDto,
      updateRoleDto,
    );
    return ResponseService.buildResponse(role);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'delete role',
  })
  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @UsePipes(new JoiValidationPipe(updateRoleParamSchema, 'param'))
  async deleteRole(@Param() updateRoleParamDto: UpdateRoleParamDto) {
    const role = await this.roleService.deleteRole(updateRoleParamDto);
    return ResponseService.buildResponse(role);
  }
}
