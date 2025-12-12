using GerenciadorLivros.Domain.Entities;

namespace GerenciadorLivros.Domain.Interfaces;

public interface ILivrosRepository
{
    Task<IEnumerable<Livro>> GetAllAsync();
    Task<IEnumerable<Livro>> GetAllByTituloAsync(string titulo);
    Task<Livro> GetByIdAsync(int id);
    Task<Livro> AddAsync(Livro entity);
    Task UpdateAsync(Livro entity);
    Task DeleteAsync(int id);
}