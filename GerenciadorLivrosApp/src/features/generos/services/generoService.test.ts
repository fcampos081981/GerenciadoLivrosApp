import { describe, it, expect, vi, afterEach } from 'vitest';
import { generoService } from './generoService';
import { httpClient } from '../../../lib/axios';

vi.mock('../../../lib/axios', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('generoService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('getAll deve chamar GET /Genero', async () => {
    const mockData = [{ id: 1, descricao: 'Terror' }];
    (httpClient.get as any).mockResolvedValue({ data: mockData });

    const result = await generoService.getAll();
    expect(httpClient.get).toHaveBeenCalledWith('/Genero');
    expect(result).toEqual(mockData);
  });

  it('getByDescricao deve chamar GET /Genero/genero/{descricao}', async () => {
    const termo = 'Ficção';
    await generoService.getByDescricao(termo);
    expect(httpClient.get).toHaveBeenCalledWith(`/Genero/genero/${termo}`);
  });

  it('create deve chamar POST /Genero com dados', async () => {
    const dto = { descricao: 'Novo Gênero' };
    (httpClient.post as any).mockResolvedValue({ data: { id: 1, ...dto } });
    
    await generoService.create(dto);
    expect(httpClient.post).toHaveBeenCalledWith('/Genero', dto);
  });

  it('update deve chamar PUT /Genero/{id}', async () => {
    const dto = { descricao: 'Editado' };
    await generoService.update(1, dto);
    expect(httpClient.put).toHaveBeenCalledWith('/Genero/1', dto);
  });

  it('delete deve chamar DELETE /Genero/{id}', async () => {
    await generoService.delete(1);
    expect(httpClient.delete).toHaveBeenCalledWith('/Genero/1');
  });
});