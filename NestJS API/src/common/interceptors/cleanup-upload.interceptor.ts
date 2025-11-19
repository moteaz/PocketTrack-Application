import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError, from } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class CleanupUploadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      catchError((err) => {
        const file = request.file;

        if (file) {
          const filePath = path.join('./uploads', file.filename);

          // Delete the file FIRST (returns an observable)
          return from(fs.unlink(filePath).catch(() => null)).pipe(
            // Re-throw the ORIGINAL error (important!)
            mergeMap(() => throwError(() => err)),
          );
        }
        // No file? Just rethrow error
        return throwError(() => err);
      }),
    );
  }
}
