import { create } from 'zustand';
import type { Genero, CreateUpdateGeneroDto } from '../types';
import { generoService } from '../services/generoService';

interface GeneroState {
  generos: Genero[];
  isLoading: boolean;

  fetchGeneros: () => Promise<void>;
  searchByDescricao: (descricao: string) => Promise<void>;
  addGenero: (dto: CreateUpdateGeneroDto) => Promise<void>;
  updateGenero: (id: number, dto: CreateUpdateGeneroDto) => Promise<void>;
  removeGenero: (id: number) => Promise<void>;
}

export const useGeneroStore = create<GeneroState>((set, get) => ({
  generos: [],
  isLoading: false,

  fetchGeneros: async () => {
    set({ isLoading: true });
    try {
      const data = await generoService.getAll();
      set({ generos: data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  searchByDescricao: async (descricao) => {
    if (!descricao.trim()) {
      await get().fetchGeneros();
      return;
    }
    set({ isLoading: true });
    try {
      const data = await generoService.getByDescricao(descricao);
      set({ generos: data });
    } catch {
      set({ generos: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addGenero: async (dto) => {
    set({ isLoading: true });
    try {
      await generoService.create(dto);
    } finally {
      set({ isLoading: false });
    }
  },

  updateGenero: async (id, dto) => {
    set({ isLoading: true });
    try {
      await generoService.update(id, dto);
    } finally {
      set({ isLoading: false });
    }
  },

  removeGenero: async (id) => {
    try {
      await generoService.delete(id);
      set((state) => ({ 
        generos: state.generos.filter(g => g.id !== id) 
      }));
    } catch (error) {
      alert("Erro ao excluir gênero. Verifique se existem livros vinculados.");
    }
  }
}));