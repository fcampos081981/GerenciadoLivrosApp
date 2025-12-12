using GerenciadorLivros.Domain.Entities;

namespace GerenciadorGeneros.Domain.Interfaces;

public interface IGeneroRepository
{
    Task<IEnumerable<Genero>> GetAllAsync();
    Task<IEnumerable<Genero>> GetAllByTituloAsync(string descricao);
    Task<Genero> GetByIdAsync(int id);
    Task<Genero> AddAsync(Genero entity);
    Task UpdateAsync(Genero entity);
    Task DeleteAsync(int id);
}