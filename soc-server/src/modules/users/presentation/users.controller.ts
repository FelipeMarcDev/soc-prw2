import { Controller, Get } from '@nestjs/common';
import { UsuarioRepository } from '../domain/repositories/usuario.repository';

@Controller('users')
export class UsersController {
  constructor(private readonly usuarios: UsuarioRepository) {}

  @Get()
  list() {
    return this.usuarios.findAll();
  }
}
