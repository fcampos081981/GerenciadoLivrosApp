import { httpClient } from '../../../lib/axios';
import type { CreateUpdateLivroDto, Livro } from '../types';

export const livroService = {
  getAll: async () => {
    const { data } = await httpClient.get<Livro[]>('/Livros');
    return data;
  },
  
  getByTitulo: async (titulo: string) => {
     const { data } = await httpClient.get<Livro[]>(`/Livros/titulo/${titulo}`);
     return data;
  },

  getById: async (id: number) => {
    const { data } = await httpClient.get(`/Livros/${id}`);
    return data;
  },

  create: async (dto: CreateUpdateLivroDto) => {
    const { data } = await httpClient.post<Livro>('/Livros', dto);
    return data;
  },

  update: async (id: number, dto: CreateUpdateLivroDto) => {
    await httpClient.put(`/Livros/${id}`, dto);
  },

  delete: async (id: number) => {
    await httpClient.delete(`/Livros/${id}`);
  }
};