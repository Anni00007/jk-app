import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

export class CreateUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'xyz@xyz.com',
    required: true,
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'password',
    example: 'Pass@123',
    required: false,
    type: String,
  })
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: true,
    type: String,
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: true,
    type: String,
  })
  lastName: string;
}

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export class LoginUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'xyz@xyz.com',
    required: true,
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'password',
    example: 'Pass@123',
    required: false,
    type: String,
  })
  password: string;
}
