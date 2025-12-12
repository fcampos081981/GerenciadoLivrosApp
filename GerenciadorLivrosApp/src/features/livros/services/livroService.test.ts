import { describe, it, expect, vi, afterEach } from 'vitest';
import { livroService } from './livroService';
import { httpClient } from '../../../lib/axios';

vi.mock('../../../lib/axios', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('livroService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('getAll deve chamar o endpoint correto', async () => {
    const mockData = [{ id: 1, titulo: 'Livro Teste' }];
    (httpClient.get as any).mockResolvedValue({ data: mockData });

    const result = await livroService.getAll();

    expect(httpClient.get).toHaveBeenCalledWith('/Livros');
    expect(result).toEqual(mockData);
  });

  it('getById deve chamar o endpoint com ID', async () => {
    const mockData = { id: 1, titulo: 'Livro Teste' };
    (httpClient.get as any).mockResolvedValue({ data: mockData });

    const result = await livroService.getById(1);

    expect(httpClient.get).toHaveBeenCalledWith('/Livros/1');
    expect(result).toEqual(mockData);
  });

  it('create deve enviar os dados via POST', async () => {
    const dto = { titulo: 'Novo', autorId: 1, generoId: 1 };
    (httpClient.post as any).mockResolvedValue({ data: { id: 1, ...dto } });

    await livroService.create(dto);

    expect(httpClient.post).toHaveBeenCalledWith('/Livros', dto);
  });

  it('update deve enviar os dados via PUT', async () => {
    const dto = { titulo: 'Atualizado', autorId: 1, generoId: 1 };
    await livroService.update(1, dto);
    expect(httpClient.put).toHaveBeenCalledWith('/Livros/1', dto);
  });

  it('delete deve chamar DELETE', async () => {
    await livroService.delete(1);
    expect(httpClient.delete).toHaveBeenCalledWith('/Livros/1');
  });
});