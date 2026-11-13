import { Module } from '@nestjs/common';
import { UsuarioRepository } from './domain/repositories/usuario.repository';
import { PrismaUsuarioRepository } from './infrastructure/repositories/prisma-usuario.repository';
import { UsuariosSeeder } from './infrastructure/seed/usuarios.seeder';
import { UsersController } from './presentation/users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    { provide: UsuarioRepository, useClass: PrismaUsuarioRepository },
    UsuariosSeeder,
  ],
  exports: [UsuarioRepository],
})
export class UsersModule {}
