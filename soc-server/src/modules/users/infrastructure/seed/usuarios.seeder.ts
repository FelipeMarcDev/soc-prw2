import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';
import { Papel } from '../../domain/enums/papel.enum';

/** Usuários de demonstração (não há login: o usuário é escolhido pelo header X-User-Id). */
export const USUARIOS_DEMO = [
  { id: 'maria-n1', nome: 'Maria (Analista N1)', papel: Papel.ANALISTA_N1 },
  { id: 'joao-n2', nome: 'João (Analista N2)', papel: Papel.ANALISTA_N2 },
  { id: 'ana-gestora', nome: 'Ana (Gestora SOC)', papel: Papel.GESTOR_SOC },
];

/** Idempotente: cria os usuários de demonstração na subida da aplicação, se não existirem. */
@Injectable()
export class UsuariosSeeder implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    for (const usuario of USUARIOS_DEMO) {
      await this.prisma.usuario.upsert({
        where: { id: usuario.id },
        update: {},
        create: usuario,
      });
    }
  }
}
