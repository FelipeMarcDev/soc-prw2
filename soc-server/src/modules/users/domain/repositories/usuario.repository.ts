import { Usuario } from '../entities/usuario.entity';

export abstract class UsuarioRepository {
  abstract findById(id: string): Promise<Usuario | null>;
  abstract findAll(): Promise<Usuario[]>;
}
