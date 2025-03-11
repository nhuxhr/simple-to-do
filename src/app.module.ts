import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ApiModule],
  providers: [AppService],
})
export class AppModule {}
