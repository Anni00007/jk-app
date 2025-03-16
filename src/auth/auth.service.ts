import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtPayload, JWTTokenType } from 'src/common/utils/jwtPayload.type';
import { JwtService } from '@nestjs/jwt';
import { RoleEnum, Users } from '@prisma/client';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async getTokens(
    user: Users,
    permissionForUser: Array<string> = [],
    role?: RoleEnum,
  ) {
    try {
      const jwtPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        permissions: permissionForUser,
        role: role,
      };

      const token = await this.jwtService.signAsync(
        { ...jwtPayload, tokenType: JWTTokenType.ACCESS },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '1h',
        },
      );

      return token;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await argon.hash(createUserDto.password);
      const viewerRole = await this.prismaService.role.findFirst({
        where: { name: RoleEnum.VIEWER },
      });

      if (!viewerRole)
        throw new NotFoundException('Viewer role does not exist');

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
      this.logger.error(error);
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.prismaService.users.findFirst({
        where: { email: loginUserDto.email },
      });

      if (!user) throw new UnauthorizedException('Invalid credentials');

      if (!user.password) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordMatch = await argon.verify(
        user.password,
        loginUserDto.password,
      );
      if (!isPasswordMatch)
        throw new UnauthorizedException('Invalid credentials');

      const role = user.roleId
        ? await this.prismaService.role.findFirst({
            where: { id: user.roleId },
            include: { permissions: true },
          })
        : await this.prismaService.role.findFirst({
            where: { name: RoleEnum.VIEWER },
            include: { permissions: true },
          });

      if (!role) throw new NotFoundException('Role does not exist');

      const permissionForUser = role.permissions.map(
        (permission) => permission.name,
      );

      return await this.getTokens(user, permissionForUser, role.name);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw error;
    }
  }
}
