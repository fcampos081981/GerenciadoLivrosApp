import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GeneroUpdateForm } from './GeneroUpdateForm';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const mockUpdateGenero = vi.fn();

vi.mock('../store/useGeneroStore', () => ({
  useGeneroStore: () => ({
    updateGenero: mockUpdateGenero,
  })
}));

vi.mock('../services/generoService', () => ({
  generoService: {
    getById: vi.fn().mockResolvedValue({ id: 50, descricao: 'Gênero Antigo' })
  }
}));

describe('GeneroUpdateForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('deve carregar dados existentes e atualizar', async () => {
    render(
      <MemoryRouter initialEntries={['/generos/editar/50']}>
        <Routes>
          <Route path="/generos/editar/:id" element={<GeneroUpdateForm />} />
          <Route path="/generos" element={<div>Redirecionou para Lista</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Gênero Antigo')).toBeInTheDocument();
    });

    const input = screen.getByDisplayValue('Gênero Antigo');
    fireEvent.change(input, { target: { value: 'Gênero Atualizado' } });

    const btnSalvar = screen.getByText('Salvar Alterações');
    fireEvent.click(btnSalvar);

    await waitFor(() => {
      expect(mockUpdateGenero).toHaveBeenCalledWith(50, { descricao: 'Gênero Atualizado' });
    });
  });
});