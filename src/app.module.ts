import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { ModulesModule } from './modules/modules.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ModulesModule, ApiModule],
  providers: [AppService],
})
export class AppModule {}
