import { create } from 'zustand';
import type { Livro, CreateUpdateLivroDto } from '../types';
import { livroService } from '../services/livroService';

interface LivroState {
    livros: Livro[];
    isLoading: boolean;
    error: string | null;
    selectedLivro: Livro | null;

    fetchLivros: () => Promise<void>;
    filterLivrosByTitulo: (titulo: string) => Promise<void>;
    addLivro: (dto: CreateUpdateLivroDto) => Promise<void>;
    updateLivro: (id: number, dto: CreateUpdateLivroDto) => Promise<void>;
    fetchLivroById: (id: number) => Promise<void>;
    removeLivro: (id: number) => Promise<void>;
}

export const useLivroStore = create<LivroState>((set, get) => ({
    livros: [],
    isLoading: false,
    error: null,
    selectedLivro: null,

    fetchLivros: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await livroService.getAll();
            set({ livros: data });
        } catch (error) {
            set({ error: 'Falha ao buscar livros' });
        } finally {
            set({ isLoading: false });
        }
    },
    fetchLivroById: async (id) => {
        set({ isLoading: true, selectedLivro: null });
        try {
            const data = await livroService.getById(id);
            set({ selectedLivro: data });
        } catch (error) {
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },

    filterLivrosByTitulo: async (titulo) => {

        if (!titulo) {
            await get().fetchLivros();
            return;
        }
        set({ isLoading: true });
        try {
            const data = await livroService.getByTitulo(titulo);
            set({ livros: data });
        } catch (e) {
            set({ livros: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    addLivro: async (dto) => {
        set({ isLoading: true });
        try {
            await livroService.create(dto);
            await get().fetchLivros();
        } catch (error) {
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },

    updateLivro: async (id, dto) => {
        set({ isLoading: true });
        try {
            await livroService.update(id, dto);
            set((state) => ({
                livros: state.livros.map((livro) =>
                    livro.id === id ? { ...livro, ...dto } : livro
                )
            }));
        } catch (error) {
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },

    removeLivro: async (id) => {
        try {
            await livroService.delete(id);
            set((state) => ({
                livros: state.livros.filter(l => l.id !== id)
            }));
        } catch (error) {
            console.error(error);
        }
    }
}));