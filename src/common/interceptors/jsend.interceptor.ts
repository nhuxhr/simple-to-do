import * as jsend from 'jsend';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class JsendInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<jsend.JSendObject> {
    return next.handle().pipe(map((data) => jsend.success(data as object)));
  }
}
