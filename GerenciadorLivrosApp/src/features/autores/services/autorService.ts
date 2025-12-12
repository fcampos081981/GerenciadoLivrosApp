import { httpClient } from '../../../lib/axios';
import type { Autor, CreateUpdateAutorDto } from '../types';

export const autorService = {
  getAll: async () => {
    const { data } = await httpClient.get<Autor[]>('/Autor');
    return data;
  },

  getById: async (id: number) => {
    const { data } = await httpClient.get<Autor>(`/Autor/${id}`);
    return data;
  },

  getByNome: async (nome: string) => {
    const { data } = await httpClient.get<Autor[]>(`/Autor/nome/${nome}`);
    return data;
  },

  create: async (dto: CreateUpdateAutorDto) => {
    const { data } = await httpClient.post<Autor>('/Autor', dto);
    return data;
  },

  update: async (id: number, dto: CreateUpdateAutorDto) => {
    await httpClient.put(`/Autor/${id}`, dto);
  },

  delete: async (id: number) => {
    await httpClient.delete(`/Autor/${id}`);
  }
};