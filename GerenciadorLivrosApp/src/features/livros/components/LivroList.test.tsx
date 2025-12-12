import { render, screen, fireEvent } from '@testing-library/react';
import { LivroList } from './LivroList';
import { vi, describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';


const mockFetchLivros = vi.fn();
const mockRemoveLivro = vi.fn();


vi.mock('../store/useLivroStore', () => ({
  useLivroStore: () => ({
    livros: [
      { id: 1, titulo: 'Clean Code', autorNome: 'Uncle Bob', generoDescricao: 'Tech' }
    ],
    isLoading: false,
    fetchLivros: mockFetchLivros,
    removeLivro: mockRemoveLivro,
    searchLivrosByTitulo: vi.fn(),
  }),
}));

describe('LivroList Component', () => {
  it('deve renderizar a lista de livros', () => {
    render(
      <BrowserRouter>
        <LivroList />
      </BrowserRouter>
    );

    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    expect(screen.getByText('Uncle Bob')).toBeInTheDocument();
  });

  it('deve chamar fetchLivros ao montar', () => {
    render(
      <BrowserRouter>
        <LivroList />
      </BrowserRouter>
    );
    expect(mockFetchLivros).toHaveBeenCalled();
  });

  it('deve chamar removeLivro ao clicar em excluir e confirmar', () => {
    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    render(
      <BrowserRouter>
        <LivroList />
      </BrowserRouter>
    );

    const deleteBtn = screen.getByTitle('Excluir');
    fireEvent.click(deleteBtn);

    expect(mockRemoveLivro).toHaveBeenCalledWith(1);
  });
});