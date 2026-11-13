import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  DomainError,
  ForbiddenError,
  NotFoundError,
} from '../../../../shared/domain/domain.error';

/** Traduz erros de domínio em respostas HTTP, mantendo o domínio livre do Nest. */
@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      error instanceof NotFoundError
        ? HttpStatus.NOT_FOUND
        : error instanceof ForbiddenError
          ? HttpStatus.FORBIDDEN
          : HttpStatus.UNPROCESSABLE_ENTITY;

    response.status(status).json({
      statusCode: status,
      message: error.message,
      error: error.name,
    });
  }
}
