import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { ResponseService } from 'src/common/response/response.service';
import { JoiValidationPipe } from 'src/common/utils/joi-validation.interface';
import { Roles } from 'src/common/decorators/role.decorator';
import { RoleEnum } from '@prisma/client';
import {
  UpdateUserRoleBodyDto,
  updateUserRoleDtoSchema,
  UpdateUserRoleParamDto,
  updateUserParamSchema,
  updateUserBodySchema,
  UpdateUserBodyDto,
} from './user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('admin/users')
export class UsereController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Users',
  })
  @Get()
  @Roles(RoleEnum.ADMIN)
  async getAllUsers() {
    const users = await this.userService.getAllUsers();
    return ResponseService.buildResponse(users);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Role for user',
  })
  @Post(':id')
  @Roles(RoleEnum.ADMIN)
  @UsePipes(new JoiValidationPipe(updateUserParamSchema, 'param'))
  @UsePipes(new JoiValidationPipe(updateUserRoleDtoSchema, 'body'))
  async updateUserRole(
    @Param() updateUserRoleParamDto: UpdateUserRoleParamDto,
    @Body() updateUserRoleBodyDto: UpdateUserRoleBodyDto,
  ) {
    const user = await this.userService.updateUserRole(
      updateUserRoleParamDto,
      updateUserRoleBodyDto,
    );
    return ResponseService.buildResponse(user);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user',
  })
  @Put(':id')
  @Roles(RoleEnum.ADMIN)
  @UsePipes(new JoiValidationPipe(updateUserParamSchema, 'param'))
  @UsePipes(new JoiValidationPipe(updateUserBodySchema, 'body'))
  async updateUser(
    @Param() updateUserRoleParamDto: UpdateUserRoleParamDto,
    @Body() updateUserBodyDto: UpdateUserBodyDto,
  ) {
    const user = await this.userService.updateUser(
      updateUserRoleParamDto,
      updateUserBodyDto,
    );

    return ResponseService.buildResponse(user);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'delete user',
  })
  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @UsePipes(new JoiValidationPipe(updateUserParamSchema, 'param'))
  async deleteUseer(@Param() updateUserRoleParamDto: UpdateUserRoleParamDto) {
    const user = await this.userService.deleteUser(updateUserRoleParamDto);
    return ResponseService.buildResponse(user);
  }
}
