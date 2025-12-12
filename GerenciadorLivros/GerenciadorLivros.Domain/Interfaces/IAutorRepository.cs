using GerenciadorLivros.Domain.Entities;

namespace GerenciadorAutors.Domain.Interfaces;

public interface IAutorRepository
{
    Task<IEnumerable<Autor>> GetAllAsync();
    Task<IEnumerable<Autor>> GetAllByTituloAsync(string nome);
    Task<Autor> GetByIdAsync(int id);
    Task<Autor> AddAsync(Autor entity);
    Task UpdateAsync(Autor entity);
    Task DeleteAsync(int id);
}