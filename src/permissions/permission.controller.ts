import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { ResponseService } from 'src/common/response/response.service';
import { JoiValidationPipe } from 'src/common/utils/joi-validation.interface';
import {
  GetPermissionByIdParamDto,
  getPermissionByIdParamSchema,
} from './permission.dto';
import { PermissionService } from './permission.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { RoleEnum } from '@prisma/client';

@ApiTags('Permissions')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get All permissions',
  })
  @Get()
  @Roles(RoleEnum.ADMIN)
  async getAllPermissions() {
    const permissions = await this.permissionService.getAllPermissions();
    return ResponseService.buildResponse(permissions);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get permission by id',
  })
  @Get(':id')
  @Roles(RoleEnum.ADMIN)
  @UsePipes(new JoiValidationPipe(getPermissionByIdParamSchema, 'param'))
  async getPermissionById(
    @Param() getPermissionByIdParamDto: GetPermissionByIdParamDto,
  ) {
    const permission = await this.permissionService.getPermissionById(
      getPermissionByIdParamDto,
    );
    return ResponseService.buildResponse(permission);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'delete permission',
  })
  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @UsePipes(new JoiValidationPipe(getPermissionByIdParamSchema, 'param'))
  async deletePermission(
    @Param() getPermissionByIdParamDto: GetPermissionByIdParamDto,
  ) {
    const permission = await this.permissionService.deletePermission(
      getPermissionByIdParamDto,
    );
    return ResponseService.buildResponse(permission);
  }
}
