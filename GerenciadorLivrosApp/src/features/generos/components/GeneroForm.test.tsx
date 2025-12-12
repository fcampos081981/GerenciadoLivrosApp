import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GeneroForm } from './GeneroForm';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

const mockAddGenero = vi.fn();

vi.mock('../store/useGeneroStore', () => ({
  useGeneroStore: () => ({
    addGenero: mockAddGenero,
    isLoading: false,
  })
}));

describe('GeneroForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve permitir digitar e salvar', async () => {
    render(<BrowserRouter><GeneroForm /></BrowserRouter>);

    const input = screen.getByPlaceholderText(/Ex: Ficção Científica/i);
    fireEvent.change(input, { target: { value: 'Romance' } });

    const btnSalvar = screen.getByText('Cadastrar');
    fireEvent.click(btnSalvar);

    await waitFor(() => {
      expect(mockAddGenero).toHaveBeenCalledWith({ descricao: 'Romance' });
    });
  });

  it('deve validar campo vazio', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<BrowserRouter><GeneroForm /></BrowserRouter>);
    
    const btnSalvar = screen.getByText('Cadastrar');
    fireEvent.click(btnSalvar);

    expect(mockAddGenero).not.toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalled();
  });
});