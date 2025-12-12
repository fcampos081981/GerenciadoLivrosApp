using GerenciadorLivros.API.Controllers;
using GerenciadorLivros.Application.DTOs;
using GerenciadorLivros.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace GerenciadorLivros.Tests.Controllers;

public class LivrosControllerTests
{
    private readonly LivrosController _controller;
    private readonly Mock<ILivroService> _serviceMock;

    public LivrosControllerTests()
    {
        _serviceMock = new Mock<ILivroService>();
        _controller = new LivrosController(_serviceMock.Object);
    }

    #region Create

    [Fact]
    public async Task Create_DeveRetornarCreatedAtAction_ComNovoLivro()
    {
        var createDto = new CreateUpdateLivroDto { Titulo = "Novo" };
        var livroCriado = new LivroDto { Id = 1, Titulo = "Novo" };

        _serviceMock.Setup(x => x.CreateAsync(createDto)).ReturnsAsync(livroCriado);

        var result = await _controller.Create(createDto);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal("GetById", createdResult.ActionName);
        Assert.Equal(1, createdResult.RouteValues["id"]);
        Assert.Equal(livroCriado, createdResult.Value);
    }

    #endregion

    #region Delete

    [Fact]
    public async Task Delete_DeveRetornarNoContent()
    {
        var id = 1;
        _serviceMock.Setup(x => x.DeleteAsync(id)).Returns(Task.CompletedTask);

        var result = await _controller.Delete(id);

        Assert.IsType<NoContentResult>(result);
    }

    #endregion

    #region GetAll

    [Fact]
    public async Task GetAll_DeveRetornarOk_ComListaDeLivros()
    {
        var livros = new List<LivroDto> { new() { Id = 1, Titulo = "Teste" } };
        _serviceMock.Setup(x => x.GetAllAsync()).ReturnsAsync(livros);

        var result = await _controller.GetAll();

        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnValue = Assert.IsAssignableFrom<IEnumerable<LivroDto>>(okResult.Value);
        Assert.Single(returnValue);
    }

    [Fact]
    public async Task GetAll_DeveRetornarNotFound_QuandoServicoRetornaNull()
    {
        _serviceMock.Setup(x => x.GetAllAsync()).ReturnsAsync((IEnumerable<LivroDto>)null);

        var result = await _controller.GetAll();

        Assert.IsType<NotFoundResult>(result);
    }

    #endregion

    #region GetById

    [Fact]
    public async Task GetById_DeveRetornarOk_QuandoLivroExiste()
    {
        var id = 1;
        var livro = new LivroDto { Id = id, Titulo = "Teste" };
        _serviceMock.Setup(x => x.GetByIdAsync(id)).ReturnsAsync(livro);

        var result = await _controller.GetById(id);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnValue = Assert.IsType<LivroDto>(okResult.Value);
        Assert.Equal(id, returnValue.Id);
    }

    [Fact]
    public async Task GetById_DeveRetornarNotFound_QuandoLivroNaoExiste()
    {
        var id = 99;
        _serviceMock.Setup(x => x.GetByIdAsync(id)).ReturnsAsync((LivroDto)null);

        var result = await _controller.GetById(id);

        Assert.IsType<NotFoundResult>(result);
    }

    #endregion

    #region GetByTitulo

    [Fact]
    public async Task GetByTitulo_DeveRetornarBadRequest_QuandoTituloVazio()
    {
        var result = await _controller.GetByTitulo("");
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Equal("O título para pesquisa não pode ser vazio.", badRequestResult.Value);
    }

    [Fact]
    public async Task GetByTitulo_DeveRetornarNotFound_QuandoListaVazia()
    {
        var titulo = "Inexistente";
        _serviceMock.Setup(x => x.GetAllByTituloAsync(titulo))
            .ReturnsAsync(new List<LivroDto>());

        var result = await _controller.GetByTitulo(titulo);

        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.Contains($"Nenhum livro encontrado contendo: '{titulo}'", notFoundResult.Value.ToString());
    }

    [Fact]
    public async Task GetByTitulo_DeveRetornarOk_QuandoEncontraLivros()
    {
        var titulo = "Existe";
        var livros = new List<LivroDto> { new() { Id = 1, Titulo = "Água Existe" } };
        _serviceMock.Setup(x => x.GetAllByTituloAsync(titulo)).ReturnsAsync(livros);

        var result = await _controller.GetByTitulo(titulo);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsAssignableFrom<IEnumerable<LivroDto>>(okResult.Value);
        Assert.Single(returnValue);
    }

    #endregion

    #region Update

    [Fact]
    public async Task Update_DeveRetornarNoContent_QuandoSucesso()
    {
        var id = 1;
        var updateDto = new CreateUpdateLivroDto { Titulo = "Atualizado" };

        _serviceMock.Setup(x => x.UpdateAsync(id, updateDto)).Returns(Task.CompletedTask);

        var result = await _controller.Update(id, updateDto);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Update_DeveRetornarNotFound_QuandoLancaKeyNotFoundException()
    {
        var id = 99;
        var updateDto = new CreateUpdateLivroDto();


        _serviceMock.Setup(x => x.UpdateAsync(id, updateDto))
            .ThrowsAsync(new KeyNotFoundException());

        var result = await _controller.Update(id, updateDto);


        Assert.IsType<NotFoundResult>(result);
    }

    #endregion
}