using GerenciadorLivros.Application.DTOs;

namespace GerenciadorLivros.Application.Interfaces;

public interface ILivroService
{
    Task<IEnumerable<LivroDto>> GetAllAsync();
    Task<IEnumerable<LivroDto>> GetAllByTituloAsync(string titulo);
    Task<LivroDto> GetByIdAsync(int id);
    Task<LivroDto> CreateAsync(CreateUpdateLivroDto updateLivroDto);
    Task UpdateAsync(int id, CreateUpdateLivroDto updateLivroDto);
    Task DeleteAsync(int id);
}