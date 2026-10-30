import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateIncidentUseCase } from '../../application/use-cases/create-incident.use-case';
import { DeleteIncidentUseCase } from '../../application/use-cases/delete-incident.use-case';
import { GetIncidentUseCase } from '../../application/use-cases/get-incident.use-case';
import { ListIncidentsUseCase } from '../../application/use-cases/list-incidents.use-case';
import { UpdateIncidentStatusUseCase } from '../../application/use-cases/update-incident-status.use-case';
import { UpdateIncidentUseCase } from '../../application/use-cases/update-incident.use-case';
import { CreateIncidentDto } from '../dtos/create-incident.dto';
import { IncidentResponseDto } from '../dtos/incident-response.dto';
import { UpdateIncidentDto } from '../dtos/update-incident.dto';
import { UpdateStatusDto } from '../dtos/update-status.dto';

@Controller('incidents')
export class IncidentsController {
  constructor(
    private readonly createIncident: CreateIncidentUseCase,
    private readonly listIncidents: ListIncidentsUseCase,
    private readonly getIncident: GetIncidentUseCase,
    private readonly updateIncident: UpdateIncidentUseCase,
    private readonly updateIncidentStatus: UpdateIncidentStatusUseCase,
    private readonly deleteIncident: DeleteIncidentUseCase,
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

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateIncidentDto) {
    return IncidentResponseDto.fromDomain(
      await this.updateIncident.execute(id, dto),
    );
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return IncidentResponseDto.fromDomain(
      await this.updateIncidentStatus.execute(id, dto.status),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.deleteIncident.execute(id);
  }
}
