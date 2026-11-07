import { CreateIncidentDto } from './create-incident.dto';

/** Só campos descritivos. O status muda exclusivamente por ações (máquina de estados). */
export class UpdateIncidentDto extends CreateIncidentDto {}