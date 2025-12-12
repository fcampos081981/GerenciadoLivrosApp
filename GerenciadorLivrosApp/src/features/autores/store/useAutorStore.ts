import { create } from 'zustand';
import type { Autor, CreateUpdateAutorDto } from '../types';
import { autorService } from '../services/autorService';

interface AutorState {
    autores: Autor[];
    selectedAutor: Autor | null;
    isLoading: boolean;

    fetchAutores: () => Promise<void>;
    fetchAutorById: (id: number) => Promise<void>;
    searchByNome: (nome: string) => Promise<void>;
    addAutor: (dto: CreateUpdateAutorDto) => Promise<void>;
    updateAutor: (id: number, dto: CreateUpdateAutorDto) => Promise<void>;
    removeAutor: (id: number) => Promise<void>;

    clearSelectedAutor: () => void;
}

export const useAutorStore = create<AutorState>((set, get) => ({
    autores: [],
    selectedAutor: null,
    isLoading: false,

    fetchAutores: async () => {
        set({ isLoading: true });
        try {
            const data = await autorService.getAll();
            set({ autores: data });
        } catch (error) {
            console.error("Erro ao buscar autores", error);
        } finally {
            set({ isLoading: false });
        }
    },
    searchByNome: async (nome) => {
        if (!nome.trim()) {
            await get().fetchAutores();
            return;
        }
        set({ isLoading: true });
        try {
            const data = await autorService.getByNome(nome);
            set({ autores: data });
        } catch {
            set({ autores: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchAutorById: async (id) => {
        set({ isLoading: true, selectedAutor: null });
        try {
            const data = await autorService.getById(id);
            set({ selectedAutor: data });
        } catch (error) {
            console.error("Erro ao buscar autor", error);
        } finally {
            set({ isLoading: false });
        }
    },

    addAutor: async (dto) => {
        set({ isLoading: true });
        try {
            await autorService.create(dto);
            await get().fetchAutores();
        } finally {
            set({ isLoading: false });
        }
    },

    updateAutor: async (id, dto) => {
        set({ isLoading: true });
        try {
            await autorService.update(id, dto);
            await get().fetchAutores();
        } finally {
            set({ isLoading: false });
        }
    },

    removeAutor: async (id) => {
        try {
            await autorService.delete(id);

            set((state) => ({
                autores: state.autores.filter(a => a.id !== id)
            }));
        } catch (error) {
            console.error("Erro ao remover autor", error);
            alert("Não foi possível excluir o autor.");
        }
    },

    clearSelectedAutor: () => set({ selectedAutor: null })
}));