import { render, screen, fireEvent } from '@testing-library/react';
import { GeneroList } from './GeneroList';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';


const mockFetchGeneros = vi.fn();
const mockSearchByDescricao = vi.fn();
const mockRemoveGenero = vi.fn();

vi.mock('../store/useGeneroStore', () => ({
  useGeneroStore: () => ({
    generos: [{ id: 1, descricao: 'Comédia' }],
    isLoading: false,
    fetchGeneros: mockFetchGeneros,
    searchByDescricao: mockSearchByDescricao,
    removeGenero: mockRemoveGenero,
  }),
}));

describe('GeneroList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar a tabela com dados', () => {
    render(<BrowserRouter><GeneroList /></BrowserRouter>);
    expect(screen.getByText('Comédia')).toBeInTheDocument();
  });

  it('deve chamar fetchGeneros ao montar', () => {
    render(<BrowserRouter><GeneroList /></BrowserRouter>);
    expect(mockFetchGeneros).toHaveBeenCalled();
  });

  it('deve realizar busca ao submeter o formulário', () => {
    render(<BrowserRouter><GeneroList /></BrowserRouter>);

    const input = screen.getByPlaceholderText(/Pesquisar por descrição/i);
    fireEvent.change(input, { target: { value: 'Comédia' } });
    
    const form = input.closest('form');
    fireEvent.submit(form!);

    expect(mockSearchByDescricao).toHaveBeenCalledWith('Comédia');
  });

  it('deve excluir ao confirmar', () => {
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
    
    render(<BrowserRouter><GeneroList /></BrowserRouter>);
    
    const btnDelete = screen.getByTitle('Excluir');
    fireEvent.click(btnDelete);

    expect(mockRemoveGenero).toHaveBeenCalledWith(1);
  });
});