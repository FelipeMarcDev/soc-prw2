import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FonteAlerta, Severidade } from '../../domain/enums/incident.enums';

export class CreateIncidentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(FonteAlerta)
  fonteAlerta: FonteAlerta;

  @IsString()
  @IsNotEmpty()
  ativoAfetado: string;

  @IsString()
  @IsNotEmpty()
  analista: string;

  @IsEnum(Severidade)
  severidade: Severidade;
}
