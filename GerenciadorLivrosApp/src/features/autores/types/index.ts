import type { BaseEntity } from '../../../types/api';

export interface Autor extends BaseEntity {
    nome: string;
}

export interface CreateUpdateAutorDto {
    nome: string;
}