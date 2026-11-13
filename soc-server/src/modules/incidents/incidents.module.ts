import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { UsersModule } from '../users/users.module';
import { CreateIncidentUseCase } from './application/use-cases/create-incident.use-case';
import { GetIncidentUseCase } from './application/use-cases/get-incident.use-case';
import { ListIncidentsUseCase } from './application/use-cases/list-incidents.use-case';
import { UpdateIncidentUseCase } from './application/use-cases/update-incident.use-case';
import { IncidentRepository } from './domain/repositories/incident.repository';
import { PrismaIncidentRepository } from './infrastructure/repositories/prisma-incident.repository';
import { IncidentsController } from './presentation/controllers/incidents.controller';
import { DomainExceptionFilter } from './presentation/filters/domain-exception.filter';
import { ExecutarAcaoIncidenteUseCase } from './application/use-cases/executar-acao-incidente.use-case';

@Module({
  imports: [UsersModule],
  controllers: [IncidentsController],
  providers: [
    // Inversão de dependência: o domínio conhece só a porta, o Nest injeta o adaptador.
    { provide: IncidentRepository, useClass: PrismaIncidentRepository },
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
    CreateIncidentUseCase,
    ListIncidentsUseCase,
    GetIncidentUseCase,
    UpdateIncidentUseCase,
    ExecutarAcaoIncidenteUseCase,
  ],
})
export class IncidentsModule {}
