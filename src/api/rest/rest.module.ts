import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { MainModule } from './main/main.module';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { JsendInterceptor } from '@/common/interceptors/jsend.interceptor';

@Module({
  imports: [MainModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: JsendInterceptor,
    },
  ],
})
export class RestModule {}
