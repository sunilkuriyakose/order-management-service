import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const { url, method, params, query, body } = request;
    const res = context.switchToHttp().getResponse();

    console.log(
      `\nIncoming Request: ${method} ${url} @ ${new Date(startTime).toISOString()}`,
    );
    console.log(`Query: ${JSON.stringify(query)}`);
    console.log(`Parameters: ${JSON.stringify(params)}`);
    console.log(`Body: ${JSON.stringify(body)}`);
    res.on('close', () => {
      const { statusCode, statusMessage } = res;
      const contentLength = res.get('content-length');
      const endTime = Date.now();
      console.log(
        `Outgoing Response: ${method} ${url}  StatusCode: ${statusCode}, StatusMessage:  ${statusMessage} Content-Length: ${contentLength} @ ${new Date(endTime).toISOString()} | Duration: ${
          endTime - startTime
        }ms`,
      );
    });
    return next.handle().pipe(
      tap((data) => {
        console.log(`\nResponse.data: ${JSON.stringify(data.data)}`);
      }),
    );
  }
}
