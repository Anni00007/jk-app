import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export const getPermissionByIdParamSchema = Joi.object({
  id: Joi.number().required(),
});

export class GetPermissionByIdParamDto {
  @ApiProperty({
    description: 'ID of Permission',
    example: 1,
    required: true,
    type: Number,
  })
  id: number;
}
