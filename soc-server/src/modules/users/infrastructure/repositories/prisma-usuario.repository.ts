import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';
import { Usuario } from '../../domain/entities/usuario.entity';
import { Papel } from '../../domain/enums/papel.enum';
import { UsuarioRepository } from '../../domain/repositories/usuario.repository';

@Injectable()
export class PrismaUsuarioRepository implements UsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Usuario | null> {
    const row = await this.prisma.usuario.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async findAll(): Promise<Usuario[]> {
    const rows = await this.prisma.usuario.findMany({ orderBy: { nome: 'asc' } });
    return rows.map(toDomain);
  }
}

function toDomain(row: { id: string; nome: string; papel: string }): Usuario {
  return { id: row.id, nome: row.nome, papel: row.papel as Papel };
}
