import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsuarioRepository } from '../domain/repositories/usuario.repository';
import { RequestComUsuario } from './request-com-usuario';

/**
 * Autenticação SIMULADA (escopo da disciplina): identifica o usuário pelo header
 * X-User-Id. Em produção isto seria um JWT/sessão; a autorização (RBAC) no domínio
 * não depende de como o usuário é identificado.
 */
@Injectable()
export class UsuarioAtualGuard implements CanActivate {
  constructor(private readonly usuarios: UsuarioRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestComUsuario>();
    const id = request.header('x-user-id');
    if (!id) {
      throw new UnauthorizedException('Informe o usuário no header X-User-Id');
    }
    const usuario = await this.usuarios.findById(id);
    if (!usuario) {
      throw new UnauthorizedException(`Usuário ${id} não encontrado`);
    }
    request.usuario = usuario;
    return true;
  }
}
