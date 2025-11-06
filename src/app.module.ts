import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    MulterModule.register({
      dest: './uploads',
    }),
    RolesModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
