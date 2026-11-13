import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateIncidentUseCase } from '../../application/use-cases/create-incident.use-case';
import { ExecutarAcaoIncidenteUseCase } from '../../application/use-cases/executar-acao-incidente.use-case';
import { ListarContencoesUseCase } from '../../application/use-cases/listar-contencoes.use-case';
import { ReclassificarIncidentUseCase } from '../../application/use-cases/reclassificar-incident.use-case';
import { RegistrarContencaoUseCase } from '../../application/use-cases/registrar-contencao.use-case';
import { GetIncidentHistoryUseCase } from '../../application/use-cases/get-incident-history.use-case';
import { GetPostMortemUseCase } from '../../application/use-cases/get-post-mortem.use-case';
import { GetIncidentUseCase } from '../../application/use-cases/get-incident.use-case';
import { RegistrarPostMortemUseCase } from '../../application/use-cases/registrar-post-mortem.use-case';
import { ListIncidentsUseCase } from '../../application/use-cases/list-incidents.use-case';
import { UpdateIncidentUseCase } from '../../application/use-cases/update-incident.use-case';
import { Usuario } from '../../../users/domain/entities/usuario.entity';
import { UsuarioAtual } from '../../../users/presentation/usuario-atual.decorator';
import { UsuarioAtualGuard } from '../../../users/presentation/usuario-atual.guard';
import { AcaoIncidenteDto } from '../dtos/acao-incidente.dto';
import { ContencaoDto } from '../dtos/contencao.dto';
import { ReclassificarDto } from '../dtos/reclassificar.dto';
import { CreateIncidentDto } from '../dtos/create-incident.dto';
import { PostMortemDto } from '../dtos/post-mortem.dto';
import { IncidentResponseDto } from '../dtos/incident-response.dto';
import { UpdateIncidentDto } from '../dtos/update-incident.dto';

@Controller('incidents')
export class IncidentsController {
  constructor(
    private readonly createIncident: CreateIncidentUseCase,
    private readonly listIncidents: ListIncidentsUseCase,
    private readonly getIncident: GetIncidentUseCase,
    private readonly updateIncident: UpdateIncidentUseCase,
    private readonly executarAcao: ExecutarAcaoIncidenteUseCase,
    private readonly getHistory: GetIncidentHistoryUseCase,
    private readonly getPostMortem: GetPostMortemUseCase,
    private readonly registrarPostMortem: RegistrarPostMortemUseCase,
    private readonly listarContencoes: ListarContencoesUseCase,
    private readonly registrarContencao: RegistrarContencaoUseCase,
    private readonly reclassificarIncident: ReclassificarIncidentUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateIncidentDto) {
    return IncidentResponseDto.fromDomain(await this.createIncident.execute(dto));
  }

  @Get()
  async findAll() {
    const incidents = await this.listIncidents.execute();
    return incidents.map(IncidentResponseDto.fromDomain);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return IncidentResponseDto.fromDomain(await this.getIncident.execute(id));
  }

  @Get(':id/history')
  async history(@Param('id') id: string) {
    return this.getHistory.execute(id);
  }

  @Get(':id/contencao')
  async contencoes(@Param('id') id: string) {
    return this.listarContencoes.execute(id);
  }

  @Post(':id/contencao')
  @UseGuards(UsuarioAtualGuard)
  async adicionarContencao(
    @Param('id') id: string,
    @Body() dto: ContencaoDto,
    @UsuarioAtual() usuario: Usuario,
  ) {
    return this.registrarContencao.execute(id, usuario, dto.descricao);
  }

  @Post(':id/reclassificar')
  @UseGuards(UsuarioAtualGuard)
  async reclassificar(
    @Param('id') id: string,
    @Body() dto: ReclassificarDto,
    @UsuarioAtual() usuario: Usuario,
  ) {
    return IncidentResponseDto.fromDomain(
      await this.reclassificarIncident.execute(
        id,
        dto.severidade,
        usuario,
        dto.justificativa,
      ),
    );
  }

  @Get(':id/post-mortem')
  async postMortem(@Param('id') id: string) {
    return this.getPostMortem.execute(id);
  }

  @Put(':id/post-mortem')
  @UseGuards(UsuarioAtualGuard)
  async salvarPostMortem(
    @Param('id') id: string,
    @Body() dto: PostMortemDto,
    @UsuarioAtual() usuario: Usuario,
  ) {
    return this.registrarPostMortem.execute(id, usuario, dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateIncidentDto) {
    return IncidentResponseDto.fromDomain(
      await this.updateIncident.execute(id, dto),
    );
  }

  @Post(':id/triar')
  @UseGuards(UsuarioAtualGuard)
  async triar(
    @Param('id') id: string,
    @Body() dto: AcaoIncidenteDto,
    @UsuarioAtual() usuario: Usuario,
  ) {
    return IncidentResponseDto.fromDomain(
      await this.executarAcao.execute(id, 'triar', usuario, dto.justificativa),
    );
  }

  @Post(':id/conter')
  @UseGuards(UsuarioAtualGuard)
  async conter(
    @Param('id') id: string,
    @Body() dto: AcaoIncidenteDto,
    @UsuarioAtual() usuario: Usuario,
  ) {
    return IncidentResponseDto.fromDomain(
      await this.executarAcao.execute(id, 'conter', usuario, dto.justificativa),
    );
  }

  @Post(':id/erradicar')
  @UseGuards(UsuarioAtualGuard)
  async erradicar(
    @Param('id') id: string,
    @Body() dto: AcaoIncidenteDto,
    @UsuarioAtual() usuario: Usuario,
  ) {
    return IncidentResponseDto.fromDomain(
      await this.executarAcao.execute(id, 'erradicar', usuario, dto.justificativa),
    );
  }

  @Post(':id/encerrar')
  @UseGuards(UsuarioAtualGuard)
  async encerrar(
    @Param('id') id: string,
    @Body() dto: AcaoIncidenteDto,
    @UsuarioAtual() usuario: Usuario,
  ) {
    return IncidentResponseDto.fromDomain(
      await this.executarAcao.execute(id, 'encerrar', usuario, dto.justificativa),
    );
  }
}