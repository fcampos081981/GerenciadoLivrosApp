using GerenciadorLivros.Application.DTOs;

namespace GerenciadorLivros.Application.Interfaces;

public interface IAutorService
{
    Task<IEnumerable<AutorDto>> GetAllAsync();
    Task<IEnumerable<AutorDto>> GetAllByNomeAsync(string nome);
    Task<AutorDto> GetByIdAsync(int id);
    Task<AutorDto> CreateAsync(CreateUpdateAutorDto livroDto);
    Task UpdateAsync(int id, CreateUpdateAutorDto livroDto);
    Task DeleteAsync(int id);
}