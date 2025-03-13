import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export const getByIdParamSchema = Joi.object({
  id: Joi.number().required(),
});

export class GetByIdParamDto {
  @ApiProperty({
    description: 'ID of File',
    example: 1,
    required: true,
    type: Number,
  })
  id: number;
}
