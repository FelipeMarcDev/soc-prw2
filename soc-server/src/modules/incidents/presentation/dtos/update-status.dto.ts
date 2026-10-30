import { IsEnum } from 'class-validator';
import { StatusIncidente } from '../../domain/enums/incident.enums';

export class UpdateStatusDto {
  @IsEnum(StatusIncidente)
  status: StatusIncidente;
}
