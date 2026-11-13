import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestComUsuario } from './request-com-usuario';

export const UsuarioAtual = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest<RequestComUsuario>().usuario,
);
