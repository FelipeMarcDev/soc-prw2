import { Papel } from '../enums/papel.enum';

export interface Usuario {
  id: string;
  nome: string;
  papel: Papel;
}
