import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export const updateRoleParamSchema = Joi.object({
  id: Joi.number().required(),
});

export class UpdateRoleParamDto {
  @ApiProperty({
    description: 'ID of Role',
    example: 1,
    required: true,
    type: Number,
  })
  id: number;
}

export const updateRoleSchema = Joi.object({
  permissionIds: Joi.array().items(Joi.number()).required(),
});

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Permission Ids',
    example: '[1,2,3]',
    type: [Number],
    required: true,
  })
  permissionIds: number[];
}
