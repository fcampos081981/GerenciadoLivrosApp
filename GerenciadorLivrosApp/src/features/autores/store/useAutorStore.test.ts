import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAutorStore } from './useAutorStore';
import { autorService } from '../services/autorService';


vi.mock('../services/autorService', () => ({
  autorService: {
    getAll: vi.fn(),
    getByNome: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('useAutorStore', () => {
  beforeEach(() => {
    useAutorStore.setState({ autores: [], isLoading: false });
    vi.clearAllMocks();
  });

  it('fetchAutores deve preencher o estado', async () => {
    const mockData = [{ id: 1, nome: 'Teste' }];
    (autorService.getAll as any).mockResolvedValue(mockData);

    await useAutorStore.getState().fetchAutores();

    expect(useAutorStore.getState().autores).toEqual(mockData);
    expect(useAutorStore.getState().isLoading).toBe(false);
  });

  it('searchByNome deve atualizar lista ou limpar se 404', async () => {

    const mockData = [{ id: 1, nome: 'Achado' }];
    (autorService.getByNome as any).mockResolvedValue(mockData);
    
    await useAutorStore.getState().searchByNome('Achado');
    expect(useAutorStore.getState().autores).toEqual(mockData);


    const erro404 = { response: { status: 404 } };
    (autorService.getByNome as any).mockRejectedValue(erro404);

    await useAutorStore.getState().searchByNome('Inexistente');
    expect(useAutorStore.getState().autores).toEqual([]);
  });

  it('removeAutor deve remover item localmente', async () => {
    useAutorStore.setState({ autores: [{ id: 1, nome: 'Deletar' }] });
    
    await useAutorStore.getState().removeAutor(1);

    expect(autorService.delete).toHaveBeenCalledWith(1);
    expect(useAutorStore.getState().autores).toHaveLength(0);
  });
});