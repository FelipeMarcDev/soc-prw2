import { IsNotEmpty, IsString } from 'class-validator';

export class AcaoIncidenteDto {
  @IsString()
  @IsNotEmpty()
  justificativa: string;
}