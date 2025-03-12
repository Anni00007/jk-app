import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto:CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
      const newUser = await this.prismaService.users.create({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
        },
      });
      return newUser.email;
    } catch (error) {
      this.logger.error(error)
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw error
    }
  }
}
