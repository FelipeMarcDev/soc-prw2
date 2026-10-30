import { IsEnum, IsOptional } from 'class-validator';
import { StatusIncidente } from '../../domain/enums/incident.enums';
import { CreateIncidentDto } from './create-incident.dto';

export class UpdateIncidentDto extends CreateIncidentDto {
  @IsOptional()
  @IsEnum(StatusIncidente)
  status?: StatusIncidente;
}
