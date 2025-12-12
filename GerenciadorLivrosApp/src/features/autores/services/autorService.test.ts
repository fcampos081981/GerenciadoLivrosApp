import { describe, it, expect, vi, afterEach } from 'vitest';
import { autorService } from './autorService';
import { httpClient } from '../../../lib/axios';

vi.mock('../../../lib/axios', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('autorService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('getAll deve chamar GET /Autor', async () => {
    const mockData = [{ id: 1, nome: 'Machado' }];
    (httpClient.get as any).mockResolvedValue({ data: mockData });

    const result = await autorService.getAll();
    expect(httpClient.get).toHaveBeenCalledWith('/Autor');
    expect(result).toEqual(mockData);
  });

  it('getByNome deve chamar GET /Autor/nome/{nome}', async () => {
    const nome = 'Assis';
    await autorService.getByNome(nome);
    expect(httpClient.get).toHaveBeenCalledWith(`/Autor/nome/${nome}`);
  });

  it('create deve chamar POST /Autor', async () => {
    const dto = { nome: 'Novo Autor' };
    (httpClient.post as any).mockResolvedValue({ data: { id: 1, ...dto } });
    const result = await autorService.create(dto);
    expect(httpClient.post).toHaveBeenCalledWith('/Autor', dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('update deve chamar PUT /Autor/{id}', async () => {
    const dto = { nome: 'Autor Editado' };
    await autorService.update(1, dto);
    expect(httpClient.put).toHaveBeenCalledWith('/Autor/1', dto);
  });

  it('delete deve chamar DELETE /Autor/{id}', async () => {
    await autorService.delete(1);
    expect(httpClient.delete).toHaveBeenCalledWith('/Autor/1');
  });
});