import { Request } from 'express';
import { Usuario } from '../domain/entities/usuario.entity';

export interface RequestComUsuario extends Request {
  usuario?: Usuario;
}
