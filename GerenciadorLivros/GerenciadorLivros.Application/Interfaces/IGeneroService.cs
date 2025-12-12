using GerenciadorLivros.Application.DTOs;

namespace GerenciadorLivros.Application.Interfaces;

public interface IGeneroService
{
    Task<IEnumerable<GeneroDto>> GetAllAsync();
    Task<IEnumerable<GeneroDto>> GetAllByDescricaoAsync(string descricao);
    Task<GeneroDto> GetByIdAsync(int id);
    Task<GeneroDto> CreateAsync(CreateUpdateGeneroDto livroDto);
    Task UpdateAsync(int id, CreateUpdateGeneroDto livroDto);
    Task DeleteAsync(int id);
}