import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleModule } from './role/role.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './gaurds/at.gaurd';
import { ConfigModule } from '@nestjs/config';
import { PermissionModule } from './permissions/permission.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, RoleModule, PermissionModule],
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
