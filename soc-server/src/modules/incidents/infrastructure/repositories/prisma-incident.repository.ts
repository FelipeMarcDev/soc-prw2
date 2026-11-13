import { Injectable } from '@nestjs/common';
import { Incident as PrismaIncident } from '@prisma/client';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';
import { Incident } from '../../domain/entities/incident.entity';
import { StatusIncidente } from '../../domain/enums/incident.enums';
import { ConflitoConcorrenciaError } from '../../domain/errors/conflito-concorrencia.error';
import {
  AcaoContencao,
  CreateIncidentData,
  HistoricoStatus,
  IncidentRepository,
  PostMortem,
  PostMortemData,
  Reclassificacao,
  Transicao,
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

  async applyTransition(id: string, t: Transicao): Promise<Incident> {
    return this.prisma.$transaction(async (tx) => {
      // O filtro por estadoAnterior garante que só uma de duas requisições
      // simultâneas na mesma etapa consegue gravar.
      const atualizados = await tx.incident.updateMany({
        where: { id, status: t.estadoAnterior },
        data: {
          status: t.novoEstado,
          ...(t.novoEstado === StatusIncidente.POS_MORTEM ? { closedAt: new Date() } : {}),
        },
      });
      if (atualizados.count === 0) throw new ConflitoConcorrenciaError(id);

      await tx.historicoStatus.create({
        data: {
          incidentId: id,
          estadoAnterior: t.estadoAnterior,
          novoEstado: t.novoEstado,
          autorId: t.autorId,
          justificativa: t.justificativa,
        },
      });

      return toDomain(await tx.incident.findUniqueOrThrow({ where: { id } }));
    });
  }

  async findHistory(incidentId: string): Promise<HistoricoStatus[]> {
    const rows = await this.prisma.historicoStatus.findMany({
      where: { incidentId },
      orderBy: { createdAt: 'asc' },
      include: { autor: true },
    });
    return rows.map((r) => ({
      id: r.id,
      acao: r.acao,
      severidadeAnterior: r.severidadeAnterior,
      severidadeNova: r.severidadeNova,
      estadoAnterior: r.estadoAnterior,
      novoEstado: r.novoEstado,
      autorId: r.autorId,
      autorNome: r.autor.nome,
      justificativa: r.justificativa,
      createdAt: r.createdAt,
    }));
  }

  async applyReclassificacao(id: string, r: Reclassificacao): Promise<Incident> {
    return this.prisma.$transaction(async (tx) => {
      const atualizados = await tx.incident.updateMany({
        where: { id, severidade: r.severidadeAnterior },
        data: { severidade: r.severidadeNova },
      });
      if (atualizados.count === 0) throw new ConflitoConcorrenciaError(id);

      await tx.historicoStatus.create({
        data: {
          incidentId: id,
          acao: 'RECLASSIFICACAO',
          estadoAnterior: r.estado,
          novoEstado: r.estado,
          severidadeAnterior: r.severidadeAnterior,
          severidadeNova: r.severidadeNova,
          autorId: r.autorId,
          justificativa: r.justificativa,
        },
      });

      return toDomain(await tx.incident.findUniqueOrThrow({ where: { id } }));
    });
  }

  async addContencao(
    incidentId: string,
    descricao: string,
    autorId: string,
  ): Promise<AcaoContencao> {
    const row = await this.prisma.acaoContencao.create({
      data: { incidentId, descricao, autorId },
      include: { autor: true },
    });
    return toContencao(row);
  }

  async findContencoes(incidentId: string): Promise<AcaoContencao[]> {
    const rows = await this.prisma.acaoContencao.findMany({
      where: { incidentId },
      orderBy: { createdAt: 'asc' },
      include: { autor: true },
    });
    return rows.map(toContencao);
  }

  countContencoes(incidentId: string): Promise<number> {
    return this.prisma.acaoContencao.count({ where: { incidentId } });
  }

  async findPostMortem(incidentId: string): Promise<PostMortem | null> {
    const row = await this.prisma.postMortem.findUnique({ where: { incidentId } });
    return row ? toPostMortem(row) : null;
  }

  async savePostMortem(
    incidentId: string,
    data: PostMortemData,
    autorId: string,
  ): Promise<PostMortem> {
    const row = await this.prisma.postMortem.upsert({
      where: { incidentId },
      create: { incidentId, ...data, autorId },
      update: { ...data, autorId },
    });
    return toPostMortem(row);
  }
}

function toContencao(row: {
  id: string;
  incidentId: string;
  descricao: string;
  autorId: string;
  createdAt: Date;
  autor: { nome: string };
}): AcaoContencao {
  return {
    id: row.id,
    incidentId: row.incidentId,
    descricao: row.descricao,
    autorId: row.autorId,
    autorNome: row.autor.nome,
    createdAt: row.createdAt,
  };
}

function toPostMortem(row: PostMortem): PostMortem {
  return {
    id: row.id,
    incidentId: row.incidentId,
    causaRaiz: row.causaRaiz,
    linhaDoTempo: row.linhaDoTempo,
    licoesAprendidas: row.licoesAprendidas,
    acoesCorretivas: row.acoesCorretivas,
    autorId: row.autorId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
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
    closedAt: row.closedAt,
  });
}
