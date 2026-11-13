import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class AcaoIncidenteDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'justificativa não pode ser vazia' })
  justificativa: string;
}