import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleModule } from './role/role.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/gaurds/at.gaurd';
import { ConfigModule } from '@nestjs/config';
import { PermissionModule } from './permissions/permission.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DocumentModule } from './documents/document.module';
import { RolesGuard } from './common/gaurds/role.gaurd';
import { IngestionModule } from './ingestion-api/ingestion.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    RoleModule,
    PermissionModule,
    DocumentModule,
    IngestionModule,
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'assets'),
      serveRoot: '/assets',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // All APIs require auth by default. For public APIs decorate it with @Public
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
