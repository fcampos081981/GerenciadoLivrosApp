import type { BaseEntity } from '../../../types/api';

export interface Livro extends BaseEntity {
  titulo: string;
  autorId: number;
  generoId: number;
  autorNome?: string;      
  generoDescricao?: string;
}

export interface CreateUpdateLivroDto {
  titulo: string;
  autorId: number;
  generoId: number;
}