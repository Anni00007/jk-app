import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleModule } from './role/role.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './gaurds/at.gaurd';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, RoleModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // All APIs require auth by default. For public APIs decorate it with @Public
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
