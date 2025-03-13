import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export const updateUserParamSchema = Joi.object({
  id: Joi.number().required(),
});

export class UpdateUserRoleParamDto {
  @ApiProperty({
    description: 'ID of Role',
    example: 1,
    required: true,
    type: Number,
  })
  id: number;
}

export const updateUserRoleDtoSchema = Joi.object({
  roleId: Joi.number().required(),
});

export class UpdateUserRoleBodyDto {
  @ApiProperty({
    description: 'Role Id',
    example: '1',
    type: Number,
    required: true,
  })
  roleId: number;
}

export const updateUserBodySchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
});

export class UpdateUserBodyDto {
  @ApiProperty({
    description: 'FirstName',
    example: 'John',
    type: String,
    required: false,
  })
  firstName: string;

  @ApiProperty({
    description: 'lastName',
    example: 'Doe',
    type: String,
    required: false,
  })
  lastName: string;
}
