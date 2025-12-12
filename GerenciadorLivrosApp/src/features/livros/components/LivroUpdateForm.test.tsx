import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LivroUpdateForm } from './LivroUpdateForm';
import { vi, describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const mockUpdateLivro = vi.fn();

vi.mock('../store/useLivroStore', () => ({
  useLivroStore: () => ({
    updateLivro: mockUpdateLivro,
  })
}));

vi.mock('../services/livroService', () => ({
  livroService: {
    getById: vi.fn().mockResolvedValue({ 
      id: 99, 
      titulo: 'Livro Antigo', 
      autorId: 10, 
      generoId: 20 
    })
  }
}));

vi.mock('../../autores/services/autorService', () => ({
  autorService: { getAll: vi.fn().mockResolvedValue([{ id: 10, nome: 'Autor X' }]) }
}));

vi.mock('../../generos/services/generoService', () => ({
  generoService: { getAll: vi.fn().mockResolvedValue([{ id: 20, descricao: 'Genero Y' }]) }
}));

describe('LivroUpdateForm Component', () => {
  it('deve preencher o formulário com dados existentes e atualizar', async () => {
    render(
      <MemoryRouter initialEntries={['/livros/editar/99']}>
        <Routes>
          <Route path="/livros/editar/:id" element={<LivroUpdateForm />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByDisplayValue('Livro Antigo')).toBeInTheDocument();
    });


    const inputTitulo = screen.getByLabelText(/Título/i);
    fireEvent.change(inputTitulo, { target: { value: 'Livro Editado' } });

    fireEvent.click(screen.getByText(/Salvar Alterações/i));


    await waitFor(() => {
      expect(mockUpdateLivro).toHaveBeenCalledWith(99, {
        titulo: 'Livro Editado',
        autorId: 10, 
        generoId: 20  
      });
    });
  });
});