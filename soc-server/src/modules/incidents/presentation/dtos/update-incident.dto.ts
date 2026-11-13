import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FonteAlerta } from '../../domain/enums/incident.enums';

/**
 * Só campos descritivos. `status` e `severidade` não entram aqui de propósito:
 * o status muda por ações e a severidade pela ação `reclassificar`.
 * (Campos extras enviados no body são descartados pelo ValidationPipe.)
 */
export class UpdateIncidentDto {
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
}
