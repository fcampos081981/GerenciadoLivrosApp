import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGeneroStore } from './useGeneroStore';
import { generoService } from '../services/generoService';

vi.mock('../services/generoService', () => ({
  generoService: {
    getAll: vi.fn(),
    getByDescricao: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('useGeneroStore', () => {
  beforeEach(() => {
    useGeneroStore.setState({ generos: [], isLoading: false });
    vi.clearAllMocks();
  });

  it('fetchGeneros deve preencher o estado', async () => {
    const mockData = [{ id: 1, descricao: 'Aventura' }];
    (generoService.getAll as any).mockResolvedValue(mockData);

    await useGeneroStore.getState().fetchGeneros();

    expect(useGeneroStore.getState().generos).toEqual(mockData);
    expect(useGeneroStore.getState().isLoading).toBe(false);
  });

  it('searchByDescricao deve filtrar a lista', async () => {
    const mockData = [{ id: 1, descricao: 'Drama' }];
    (generoService.getByDescricao as any).mockResolvedValue(mockData);

    await useGeneroStore.getState().searchByDescricao('Drama');

    expect(useGeneroStore.getState().generos).toEqual(mockData);
    expect(generoService.getByDescricao).toHaveBeenCalledWith('Drama');
  });

  it('removeGenero deve remover do estado local', async () => {
    useGeneroStore.setState({ generos: [{ id: 1, descricao: 'Remover' }] });

    await useGeneroStore.getState().removeGenero(1);

    expect(generoService.delete).toHaveBeenCalledWith(1);
    expect(useGeneroStore.getState().generos).toHaveLength(0);
  });
});