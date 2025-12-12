using AutoMapper;
using GerenciadorAutors.Domain.Interfaces;
using GerenciadorLivros.Application.DTOs;
using GerenciadorLivros.Application.Services;
using GerenciadorLivros.Domain.Entities;
using Moq;

namespace GerenciadorLivros.Tests.Services;

public class AutorServiceTests
{
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IAutorRepository> _repoMock;
    private readonly AutorService _service;

    public AutorServiceTests()
    {
        _repoMock = new Mock<IAutorRepository>();
        _mapperMock = new Mock<IMapper>();
        _service = new AutorService(_repoMock.Object, _mapperMock.Object);
    }

    [Fact]
    public async Task GetAllAsync_DeveRetornarListaDeAutores()
    {
        var listaAutores = new List<Autor> { new() { Id = 1, Nome = "Autor Teste" } };
        var listaDtos = new List<AutorDto> { new() { Id = 1, Nome = "Autor Teste" } };

        _repoMock.Setup(x => x.GetAllAsync()).ReturnsAsync(listaAutores);
        _mapperMock.Setup(m => m.Map<IEnumerable<AutorDto>>(listaAutores)).Returns(listaDtos);

        var result = await _service.GetAllAsync();

        Assert.NotNull(result);
        Assert.Single(result);
        _repoMock.Verify(x => x.GetAllAsync(), Times.Once);
    }

    [Fact]
    public async Task GetAllByNomeAsync_DeveChamarRepositorioComFiltro()
    {
        var nomeBusca = "King";
        var listaAutores = new List<Autor> { new() { Id = 1, Nome = "Stephen King" } };
        var listaDtos = new List<AutorDto> { new() { Id = 1, Nome = "Stephen King" } };

        _repoMock.Setup(x => x.GetAllByTituloAsync(nomeBusca)).ReturnsAsync(listaAutores);
        _mapperMock.Setup(m => m.Map<IEnumerable<AutorDto>>(listaAutores)).Returns(listaDtos);

        var result = await _service.GetAllByNomeAsync(nomeBusca);

        Assert.NotNull(result);
        Assert.Equal("Stephen King", result.First().Nome);
        _repoMock.Verify(x => x.GetAllByTituloAsync(nomeBusca), Times.Once);
    }

    [Fact]
    public async Task GetByIdAsync_DeveRetornarAutor_QuandoExiste()
    {
        var id = 1;
        var autor = new Autor { Id = id, Nome = "Teste" };
        var autorDto = new AutorDto { Id = id, Nome = "Teste" };

        _repoMock.Setup(x => x.GetByIdAsync(id)).ReturnsAsync(autor);
        _mapperMock.Setup(m => m.Map<AutorDto>(autor)).Returns(autorDto);

        var result = await _service.GetByIdAsync(id);

        Assert.NotNull(result);
        Assert.Equal(id, result.Id);
    }

    [Fact]
    public async Task CreateAsync_DeveMapearSalvarERetornarDto()
    {
        var createDto = new CreateUpdateAutorDto { Nome = "Novo Autor" };
        var autorEntity = new Autor { Nome = "Novo Autor" };
        var autorSalvo = new Autor { Id = 5, Nome = "Novo Autor" };
        var autorDtoRetorno = new AutorDto { Id = 5, Nome = "Novo Autor" };

        _mapperMock.Setup(m => m.Map<Autor>(createDto)).Returns(autorEntity);
        _repoMock.Setup(r => r.AddAsync(autorEntity)).ReturnsAsync(autorSalvo);
        _mapperMock.Setup(m => m.Map<AutorDto>(autorSalvo)).Returns(autorDtoRetorno);

        var result = await _service.CreateAsync(createDto);

        Assert.NotNull(result);
        Assert.Equal(5, result.Id);
        _repoMock.Verify(r => r.AddAsync(It.IsAny<Autor>()), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_DeveAtualizar_QuandoAutorExiste()
    {
        var id = 1;
        var updateDto = new CreateUpdateAutorDto { Nome = "Nome Alterado" };
        var autorExistente = new Autor { Id = id, Nome = "Nome Antigo" };

        _repoMock.Setup(x => x.GetByIdAsync(id)).ReturnsAsync(autorExistente);

        await _service.UpdateAsync(id, updateDto);

        _mapperMock.Verify(m => m.Map(updateDto, autorExistente), Times.Once);
        _repoMock.Verify(x => x.UpdateAsync(autorExistente), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_DeveLancarException_QuandoAutorNaoExiste()
    {
        var id = 99;
        var updateDto = new CreateUpdateAutorDto { Nome = "Teste" };

        _repoMock.Setup(x => x.GetByIdAsync(id)).ReturnsAsync((Autor)null);

        var exception = await Assert.ThrowsAsync<Exception>(() => _service.UpdateAsync(id, updateDto));

        Assert.Equal("Autor não encontrado", exception.Message);
        _repoMock.Verify(x => x.UpdateAsync(It.IsAny<Autor>()), Times.Never);
    }

    [Fact]
    public async Task DeleteAsync_DeveChamarMetodoDeleteDoRepositorio()
    {
        var id = 10;

        await _service.DeleteAsync(id);

        _repoMock.Verify(x => x.DeleteAsync(id), Times.Once);
    }
}