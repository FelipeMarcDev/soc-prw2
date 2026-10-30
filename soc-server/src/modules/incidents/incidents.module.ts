import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CreateIncidentUseCase } from './application/use-cases/create-incident.use-case';
import { DeleteIncidentUseCase } from './application/use-cases/delete-incident.use-case';
import { GetIncidentUseCase } from './application/use-cases/get-incident.use-case';
import { ListIncidentsUseCase } from './application/use-cases/list-incidents.use-case';
import { UpdateIncidentStatusUseCase } from './application/use-cases/update-incident-status.use-case';
import { UpdateIncidentUseCase } from './application/use-cases/update-incident.use-case';
import { IncidentRepository } from './domain/repositories/incident.repository';
import { PrismaIncidentRepository } from './infrastructure/repositories/prisma-incident.repository';
import { IncidentsController } from './presentation/controllers/incidents.controller';
import { DomainExceptionFilter } from './presentation/filters/domain-exception.filter';

@Module({
  controllers: [IncidentsController],
  providers: [
    // Inversão de dependência: o domínio conhece só a porta, o Nest injeta o adaptador.
    { provide: IncidentRepository, useClass: PrismaIncidentRepository },
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
    CreateIncidentUseCase,
    ListIncidentsUseCase,
    GetIncidentUseCase,
    UpdateIncidentUseCase,
    UpdateIncidentStatusUseCase,
    DeleteIncidentUseCase,
  ],
})
export class IncidentsModule {}
