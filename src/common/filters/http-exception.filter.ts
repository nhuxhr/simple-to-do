import * as jsend from 'jsend';
import { Request, Response } from 'express';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json(
      jsend.error({
        message: exception.message,
        code: status,
        data: {
          path: request.url,
          timestamp: new Date().toISOString(),
        },
      }),
    );
  }
}
