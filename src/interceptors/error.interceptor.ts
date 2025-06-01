import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import BadRequestError from '@errors/BadRequestError';
import NotFoundError from '@errors/NotFoundError';
import SourceUnavailableError from '@errors/SourceUnavailableError';
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

        if (err instanceof NotFoundError) {
          throw new NotFoundException(err.message || 'ressource not found');
        }

        if (err instanceof SourceUnavailableError) {
          throw new ServiceUnavailableException(
            err.message || 'service not available',
          );
        }

        throw new InternalServerErrorException('Internal server error');
      }),
    );
  }
}
