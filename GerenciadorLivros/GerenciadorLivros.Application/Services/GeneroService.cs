using AutoMapper;
using GerenciadorGeneros.Domain.Interfaces;
using GerenciadorLivros.Application.DTOs;
using GerenciadorLivros.Application.Interfaces;
using GerenciadorLivros.Domain.Entities;

namespace GerenciadorLivros.Application.Services;

public class GeneroService : IGeneroService
{
    private readonly IGeneroRepository _generoRepository;
    private readonly IMapper _mapper;

    public GeneroService(IGeneroRepository generoRepository, IMapper mapper)
    {
        _generoRepository = generoRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<GeneroDto>> GetAllAsync()
    {
        var generos = await _generoRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<GeneroDto>>(generos);
    }

    public async Task<IEnumerable<GeneroDto>> GetAllByDescricaoAsync(string descricao)
    {
        var generos = await _generoRepository.GetAllByTituloAsync(descricao);
        return _mapper.Map<IEnumerable<GeneroDto>>(generos);
    }

    public async Task<GeneroDto> GetByIdAsync(int id)
    {
        var genero = await _generoRepository.GetByIdAsync(id);
        return _mapper.Map<GeneroDto>(genero);
    }

    public async Task<GeneroDto> CreateAsync(CreateUpdateGeneroDto livroDto)
    {
        var genero = _mapper.Map<Genero>(livroDto);
        var result = await _generoRepository.AddAsync(genero);
        return _mapper.Map<GeneroDto>(result);
    }

    public async Task UpdateAsync(int id, CreateUpdateGeneroDto livroDto)
    {
        var existGenero = await _generoRepository.GetByIdAsync(id);
        if (existGenero == null) throw new Exception("Genero inexistente");

        _mapper.Map(livroDto, existGenero);
        await _generoRepository.UpdateAsync(existGenero);
    }

    public async Task DeleteAsync(int id)
    {
        await _generoRepository.DeleteAsync(id);
    }
}