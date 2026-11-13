import { IsNotEmpty, IsString, Matches } from 'class-validator';

const NAO_VAZIO = { message: 'não pode ser vazio' };

export class PostMortemDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, NAO_VAZIO)
  causaRaiz: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, NAO_VAZIO)
  linhaDoTempo: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, NAO_VAZIO)
  licoesAprendidas: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, NAO_VAZIO)
  acoesCorretivas: string;
}
