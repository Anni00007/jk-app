import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AtStrategy } from 'src/strategy/at.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, PassportModule, ConfigModule.forRoot()],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy],
})
export class AuthModule {}
