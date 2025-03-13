import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { ResponseService } from 'src/response/response.service';
import { JoiValidationPipe } from 'src/utils/joi-validation.interface';
import {
  GetPermissionByIdParamDto,
  getPermissionByIdParamSchema,
} from './permission.dto';
import { PermissionService } from './permission.service';

@ApiTags('Permissions')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get All permissions',
  })
  @Get()
  async getAllPermissions() {
    const permissions = await this.permissionService.getAllPermissions();
    return ResponseService.buildResponse(permissions);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get permission by id',
  })
  @Get(':id')
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
