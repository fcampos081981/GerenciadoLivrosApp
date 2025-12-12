import type { BaseEntity } from '../../../types/api';

export interface Genero extends BaseEntity {
    descricao: string;
}

export interface CreateUpdateGeneroDto {
    descricao: string;
}