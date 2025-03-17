import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Users, RoleEnum } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let mockUser: Users;

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockPrismaService = {
    users: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    role: {
      findFirst: jest.fn(),
    },
  };

  const createUserDto = {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
  };

  const loginUserDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockRole = {
    id: 1,
    name: RoleEnum.VIEWER,
    permissions: [{ name: 'read' }, { name: 'write' }],
  };

  beforeEach(async () => {
    // Create mockUser with hashed password
    mockUser = {
      id: 1,
      email: 'test@example.com',
      password: await argon.hash(createUserDto.password),
      firstName: 'John',
      lastName: 'Doe',
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('create', () => {
    it('should create a new user and return email', async () => {
      // Arrange
      mockPrismaService.role.findFirst.mockResolvedValue(mockRole);
      mockPrismaService.users.create.mockResolvedValue(mockUser);

      // Act
      const result = await authService.create(createUserDto);

      // Assert
      expect(result).toBe(mockUser.email);
      expect(mockPrismaService.users.create).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email,
          password: expect.any(String),
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
        },
      });
    });

    it('should throw NotFoundException if viewer role does not exist', async () => {
      // Arrange
      mockPrismaService.role.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(authService.create(createUserDto)).rejects.toThrow(
        new NotFoundException('Viewer role does not exist'),
      );
    });
  });

  describe('login', () => {
    it('should return a JWT token if credentials are valid', async () => {
      // Arrange
      mockPrismaService.users.findFirst.mockResolvedValue(mockUser);
      mockPrismaService.role.findFirst.mockResolvedValue(mockRole);
      jest.spyOn(argon, 'verify').mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('jwtToken');

      // Act
      const result = await authService.login(loginUserDto);

      // Assert
      expect(result).toBe('jwtToken');
      expect(mockPrismaService.users.findFirst).toHaveBeenCalledWith({
        where: { email: loginUserDto.email },
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: mockUser.id,
          email: mockUser.email,
          permissions: mockRole.permissions.map(
            (permission) => permission.name,
          ),
          role: mockRole.name,
        }),
        expect.any(Object),
      );
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      // Arrange
      mockPrismaService.users.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(authService.login(loginUserDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      // Arrange
      mockPrismaService.users.findFirst.mockResolvedValue(mockUser);
      jest.spyOn(argon, 'verify').mockResolvedValue(false);

      // Act & Assert
      await expect(authService.login(loginUserDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });

    it('should throw NotFoundException if role does not exist', async () => {
      // Arrange
      mockPrismaService.users.findFirst.mockResolvedValue(mockUser);
      mockPrismaService.role.findFirst.mockResolvedValue(null);
      jest.spyOn(argon, 'verify').mockResolvedValue(true);

      // Act & Assert
      await expect(authService.login(loginUserDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });
  });
});
