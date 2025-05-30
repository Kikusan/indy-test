import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import BadRequestError from '@errors/BadRequestError';
@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof HttpException) {
          throw err;
        }
        if (err instanceof BadRequestError) {
          throw new BadRequestException(
            `${err.name}: ${err.message || 'Bad request'}`,
          );
        }

        throw new InternalServerErrorException('Internal server error');
      }),
    );
  }
}
