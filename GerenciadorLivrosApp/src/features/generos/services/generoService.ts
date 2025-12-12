import { httpClient } from '../../../lib/axios';
import type { Genero, CreateUpdateGeneroDto } from '../types';

export const generoService = {
  getAll: async () => {
    const { data } = await httpClient.get<Genero[]>('/Genero');
    return data;
  },

  getById: async (id: number) => {
    const { data } = await httpClient.get<Genero>(`/Genero/${id}`);
    return data;
  },

  getByDescricao: async (descricao: string) => {
    const { data } = await httpClient.get<Genero[]>(`/Genero/genero/${descricao}`);
    return data;
  },

  create: async (dto: CreateUpdateGeneroDto) => {
    const { data } = await httpClient.post<Genero>('/Genero', dto);
    return data;
  },

  update: async (id: number, dto: CreateUpdateGeneroDto) => {
    await httpClient.put(`/Genero/${id}`, dto);
  },

  delete: async (id: number) => {
    await httpClient.delete(`/Genero/${id}`);
  }
};