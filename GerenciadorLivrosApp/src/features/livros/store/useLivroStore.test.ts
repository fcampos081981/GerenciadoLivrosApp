import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLivroStore } from './useLivroStore';
import { livroService } from '../services/livroService';


vi.mock('../services/livroService', () => ({
  livroService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getByTitulo: vi.fn(),
  },
}));

describe('useLivroStore', () => {
  beforeEach(() => {
    useLivroStore.setState({ livros: [], isLoading: false });
    vi.clearAllMocks();
  });

  it('fetchLivros deve atualizar o estado com dados', async () => {
    const mockLivros = [{ id: 1, titulo: 'Teste', autorId: 1, generoId: 1 }];
    (livroService.getAll as any).mockResolvedValue(mockLivros);

    await useLivroStore.getState().fetchLivros();

    const { livros, isLoading } = useLivroStore.getState();
    expect(livros).toEqual(mockLivros);
    expect(isLoading).toBe(false);
  });

  it('addLivro deve criar e recarregar a lista', async () => {

    (livroService.create as any).mockResolvedValue({});
    (livroService.getAll as any).mockResolvedValue([{ id: 1, titulo: 'Novo' }]);

    await useLivroStore.getState().addLivro({ titulo: 'Novo', autorId: 1, generoId: 1 });

    expect(livroService.create).toHaveBeenCalled();

    expect(livroService.getAll).toHaveBeenCalled();
    expect(useLivroStore.getState().livros).toHaveLength(1);
  });

  it('removeLivro deve remover item do estado localmente', async () => {
    useLivroStore.setState({ 
        livros: [{ id: 1, titulo: 'Para deletar', autorId: 1, generoId: 1 }] 
    });
    
    await useLivroStore.getState().removeLivro(1);

    expect(livroService.delete).toHaveBeenCalledWith(1);
    expect(useLivroStore.getState().livros).toHaveLength(0);
  });
});