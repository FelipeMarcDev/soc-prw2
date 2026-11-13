import { Injectable } from '@nestjs/common';
import { Incident as PrismaIncident } from '@prisma/client';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';
import { Incident } from '../../domain/entities/incident.entity';
import { StatusIncidente } from '../../domain/enums/incident.enums';
import {
  CreateIncidentData,
  IncidentRepository,
  UpdateIncidentData,
} from '../../domain/repositories/incident.repository';

@Injectable()
export class PrismaIncidentRepository implements IncidentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Incident[]> {
    const rows = await this.prisma.incident.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(toDomain);
  }

  async findById(id: string): Promise<Incident | null> {
    const row = await this.prisma.incident.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async create(data: CreateIncidentData): Promise<Incident> {
    return toDomain(await this.prisma.incident.create({ data }));
  }

  async update(id: string, data: UpdateIncidentData): Promise<Incident> {
    return toDomain(await this.prisma.incident.update({ where: { id }, data }));
  }

  async updateStatus(id: string, status: StatusIncidente): Promise<Incident> {
    return toDomain(
      await this.prisma.incident.update({ where: { id }, data: { status } }),
    );
  }
}

function toDomain(row: PrismaIncident): Incident {
  return new Incident({
    id: row.id,
    title: row.title,
    description: row.description,
    fonteAlerta: row.fonteAlerta,
    ativoAfetado: row.ativoAfetado,
    analista: row.analista,
    severidade: row.severidade,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}
