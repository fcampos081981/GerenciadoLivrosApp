import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AutorUpdateForm } from './AutorUpdateForm';
import { vi, describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const mockUpdateAutor = vi.fn();

vi.mock('../store/useAutorStore', () => ({
  useAutorStore: () => ({
    updateAutor: mockUpdateAutor,
  })
}));

vi.mock('../services/autorService', () => ({
  autorService: {
    getById: vi.fn().mockResolvedValue({ id: 10, nome: 'Autor Antigo' })
  }
}));

describe('AutorUpdateForm', () => {
  it('deve carregar dados e permitir edição', async () => {
    render(
      <MemoryRouter initialEntries={['/autores/editar/10']}>
        <Routes>
          <Route path="/autores/editar/:id" element={<AutorUpdateForm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Autor Antigo')).toBeInTheDocument();
    });

    const input = screen.getByDisplayValue('Autor Antigo');
    fireEvent.change(input, { target: { value: 'Autor Novo' } });

    const btnSalvar = screen.getByText('Salvar Alterações');
    fireEvent.click(btnSalvar);

    await waitFor(() => {
      expect(mockUpdateAutor).toHaveBeenCalledWith(10, { nome: 'Autor Novo' });
    });
  });
});