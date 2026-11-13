import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Severidade } from '../../domain/enums/incident.enums';

export class ReclassificarDto {
  @IsEnum(Severidade)
  severidade: Severidade;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'justificativa não pode ser vazia' })
  justificativa: string;
}
