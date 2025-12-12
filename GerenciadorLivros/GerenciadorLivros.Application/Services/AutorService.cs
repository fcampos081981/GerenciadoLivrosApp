using AutoMapper;
using GerenciadorAutors.Domain.Interfaces;
using GerenciadorLivros.Application.DTOs;
using GerenciadorLivros.Application.Interfaces;
using GerenciadorLivros.Domain.Entities;

namespace GerenciadorLivros.Application.Services;

public class AutorService : IAutorService
{
    private readonly IAutorRepository _autorRepository;
    private readonly IMapper _mapper;

    public AutorService(IAutorRepository autorRepository, IMapper mapper)
    {
        _autorRepository = autorRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<AutorDto>> GetAllAsync()
    {
        var autores = await _autorRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<AutorDto>>(autores);
    }

    public async Task<IEnumerable<AutorDto>> GetAllByNomeAsync(string nome)
    {
        var autores = await _autorRepository.GetAllByTituloAsync(nome);
        return _mapper.Map<IEnumerable<AutorDto>>(autores);
    }

    public async Task<AutorDto> GetByIdAsync(int id)
    {
        var autor = await _autorRepository.GetByIdAsync(id);
        return _mapper.Map<AutorDto>(autor);
    }

    public async Task<AutorDto> CreateAsync(CreateUpdateAutorDto livroDto)
    {
        var autor = _mapper.Map<Autor>(livroDto);
        var result = await _autorRepository.AddAsync(autor);
        return _mapper.Map<AutorDto>(result);
    }

    public async Task UpdateAsync(int id, CreateUpdateAutorDto livroDto)
    {
        var existAutor = await _autorRepository.GetByIdAsync(id);
        if (existAutor == null)
            throw new Exception("Autor não encontrado");

        _mapper.Map(livroDto, existAutor);
        await _autorRepository.UpdateAsync(existAutor);
    }

    public async Task DeleteAsync(int id)
    {
        await _autorRepository.DeleteAsync(id);
    }
}