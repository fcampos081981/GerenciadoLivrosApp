import { render, screen, fireEvent } from '@testing-library/react';
import { AutorList } from './AutorList';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

const mockFetchAutores = vi.fn();
const mockSearchByNome = vi.fn();
const mockRemoveAutor = vi.fn();

vi.mock('../store/useAutorStore', () => ({
  useAutorStore: () => ({
    autores: [{ id: 1, nome: 'Clarice Lispector' }],
    isLoading: false,
    fetchAutores: mockFetchAutores,
    searchByNome: mockSearchByNome,
    removeAutor: mockRemoveAutor,
  }),
}));

describe('AutorList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar a lista de autores', () => {
    render(
      <BrowserRouter>
        <AutorList />
      </BrowserRouter>
    );
    expect(screen.getByText('Clarice Lispector')).toBeInTheDocument();
  });

  it('deve chamar fetchAutores ao montar', () => {
    render(<BrowserRouter><AutorList /></BrowserRouter>);
    expect(mockFetchAutores).toHaveBeenCalled();
  });

  it('deve acionar busca ao digitar', () => {

    render(<BrowserRouter><AutorList /></BrowserRouter>);
    
    const input = screen.getByPlaceholderText(/Pesquisar autor/i);
    fireEvent.change(input, { target: { value: 'Clarice' } });

    const form = input.closest('form');
    fireEvent.submit(form!);

    expect(mockSearchByNome).toHaveBeenCalledWith('Clarice');
  });

  it('deve chamar removeAutor ao confirmar exclusão', () => {
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
    
    render(<BrowserRouter><AutorList /></BrowserRouter>);
    
    const btnDelete = screen.getByTitle('Excluir');
    fireEvent.click(btnDelete);

    expect(mockRemoveAutor).toHaveBeenCalledWith(1);
  });
});