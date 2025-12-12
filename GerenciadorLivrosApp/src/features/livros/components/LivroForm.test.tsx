import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LivroForm } from './LivroForm';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';


vi.mock('../../autores/services/autorService', () => ({
  autorService: {
    getAll: vi.fn().mockResolvedValue([{ id: 10, nome: 'J.K. Rowling' }])
  }
}));

vi.mock('../../generos/services/generoService', () => ({
  generoService: {
    getAll: vi.fn().mockResolvedValue([{ id: 20, descricao: 'Fantasia' }])
  }
}));

const mockAddLivro = vi.fn();

vi.mock('../store/useLivroStore', () => ({
  useLivroStore: () => ({
    addLivro: mockAddLivro,
    isLoading: false,
  })
}));

describe('LivroForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve carregar autores e generos e permitir salvar', async () => {
    render(
      <BrowserRouter>
        <LivroForm />
      </BrowserRouter>
    );


    await waitFor(() => {
      expect(screen.getByText('J.K. Rowling')).toBeInTheDocument();
    });


    fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'Harry Potter' } });
    fireEvent.change(screen.getByLabelText(/Autor/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Gênero/i), { target: { value: '20' } });

 
    const saveBtn = screen.getByText(/Salvar Livro/i);
    fireEvent.click(saveBtn);

  
    await waitFor(() => {
        expect(mockAddLivro).toHaveBeenCalledWith({
          titulo: 'Harry Potter',
          autorId: 10,
          generoId: 20
        });
    });
  });
});