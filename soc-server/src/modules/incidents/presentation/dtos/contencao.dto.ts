import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ContencaoDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'descricao não pode ser vazia' })
  descricao: string;
}
