import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UsereController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsereController],
  providers: [UserService],
})
export class UserModule {}
