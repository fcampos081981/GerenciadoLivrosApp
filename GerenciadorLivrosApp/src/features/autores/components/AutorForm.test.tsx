import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AutorForm } from './AutorForm';
import { vi, describe, it, expect, beforeEach } from 'vitest';  
import { BrowserRouter } from 'react-router-dom';

const mockAddAutor = vi.fn();

vi.mock('../store/useAutorStore', () => ({
  useAutorStore: () => ({
    addAutor: mockAddAutor,
    isLoading: false
  })
}));

describe('AutorForm', () => {
  beforeEach(() => {
    vi.clearAllMocks(); 
  });

  it('deve permitir digitar e salvar', async () => {
    render(<BrowserRouter><AutorForm /></BrowserRouter>);

    const input = screen.getByPlaceholderText(/Ex: Machado de Assis/i);
    fireEvent.change(input, { target: { value: 'Novo Autor' } });

    const btnSalvar = screen.getByText('Cadastrar Autor');
    fireEvent.click(btnSalvar);

    await waitFor(() => {
      expect(mockAddAutor).toHaveBeenCalledWith({ nome: 'Novo Autor' });
    });
  });

  it('não deve salvar se nome vazio', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<BrowserRouter><AutorForm /></BrowserRouter>);

    const btnSalvar = screen.getByText('Cadastrar Autor');
    fireEvent.click(btnSalvar);

    expect(mockAddAutor).not.toHaveBeenCalled(); 
    expect(alertMock).toHaveBeenCalled();
  });
});