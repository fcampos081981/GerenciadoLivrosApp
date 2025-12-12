using AutoMapper;
using GerenciadorLivros.Application.DTOs;
using GerenciadorLivros.Application.Interfaces;
using GerenciadorLivros.Domain.Entities;
using GerenciadorLivros.Domain.Interfaces;

namespace GerenciadorLivros.Application.Services;

public class LivroService : ILivroService
{
    private readonly ILivrosRepository _livrosRepository;
    private readonly IMapper _mapper;

    public LivroService(ILivrosRepository livrosRepository, IMapper mapper)
    {
        _livrosRepository = livrosRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<LivroDto>> GetAllAsync()
    {
        var livros = await _livrosRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<LivroDto>>(livros);
    }

    public async Task<IEnumerable<LivroDto>> GetAllByTituloAsync(string titulo)
    {
        var livros = await _livrosRepository.GetAllByTituloAsync(titulo);
        return _mapper.Map<IEnumerable<LivroDto>>(livros);
    }

    public async Task<LivroDto> GetByIdAsync(int id)
    {
        var livro = await _livrosRepository.GetByIdAsync(id);
        return _mapper.Map<LivroDto>(livro);
    }

    public async Task<LivroDto> CreateAsync(CreateUpdateLivroDto updateLivroDto)
    {
        var livro = _mapper.Map<Livro>(updateLivroDto);
        var result = await _livrosRepository.AddAsync(livro);
        return _mapper.Map<LivroDto>(result);
    }

    public async Task UpdateAsync(int id, CreateUpdateLivroDto updateLivroDto)
    {
        var existLivro = await _livrosRepository.GetByIdAsync(id);
        if (existLivro == null)
            throw new Exception("Livro não encontrado");
        _mapper.Map(updateLivroDto, existLivro);
        await _livrosRepository.UpdateAsync(existLivro);
    }

    public async Task DeleteAsync(int id)
    {
        await _livrosRepository.DeleteAsync(id);
    }
}