import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [PrismaModule, JwtModule],
})
export class ModulesModule {}
