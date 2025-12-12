using GerenciadorLivros.API.Controllers;
using GerenciadorLivros.Application.DTOs;
using GerenciadorLivros.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace GerenciadorLivros.Tests.Controllers;

public class AutorControllerTests
{
    private readonly AutorController _controller;
    private readonly Mock<IAutorService> _serviceMock;

    public AutorControllerTests()
    {
        _serviceMock = new Mock<IAutorService>();
        _controller = new AutorController(_serviceMock.Object);
    }

    #region Create

    [Fact]
    public async Task Create_DeveRetornarCreatedAtAction()
    {
        var inputDto = new CreateUpdateAutorDto { Nome = "Novo Autor" };
        var outputDto = new AutorDto { Id = 10, Nome = "Novo Autor" };

        _serviceMock.Setup(x => x.CreateAsync(inputDto)).ReturnsAsync(outputDto);

        var result = await _controller.Create(inputDto);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal("GetById", createdResult.ActionName);
        Assert.Equal(10, createdResult.RouteValues["id"]);
        Assert.Equal(outputDto, createdResult.Value);
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
    public async Task GetAllAsync_DeveRetornarOk_ComListaDeAutores()
    {
        var autores = new List<AutorDto>
        {
            new() { Id = 1, Nome = "J.K. Rowling" }
        };
        _serviceMock.Setup(x => x.GetAllAsync()).ReturnsAsync(autores);

        var result = await _controller.GetAllAsync();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsAssignableFrom<IEnumerable<AutorDto>>(okResult.Value);
        Assert.Single(returnValue);
    }

    [Fact]
    public async Task GetAllAsync_DeveRetornarNotFound_QuandoServicoRetornaNull()
    {
        _serviceMock.Setup(x => x.GetAllAsync()).ReturnsAsync((IEnumerable<AutorDto>)null);

        var result = await _controller.GetAllAsync();

        Assert.IsType<NotFoundResult>(result.Result);
    }

    #endregion

    #region GetById

    [Fact]
    public async Task GetById_DeveRetornarOk_QuandoAutorExiste()
    {
        var id = 1;
        var autor = new AutorDto { Id = id, Nome = "Tolkien" };
        _serviceMock.Setup(x => x.GetByIdAsync(id)).ReturnsAsync(autor);

        var result = await _controller.GetById(id);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnValue = Assert.IsType<AutorDto>(okResult.Value);
        Assert.Equal("Tolkien", returnValue.Nome);
    }

    [Fact]
    public async Task GetById_DeveRetornarNotFound_QuandoAutorNaoExiste()
    {
        var id = 99;
        _serviceMock.Setup(x => x.GetByIdAsync(id)).ReturnsAsync((AutorDto)null);

        var result = await _controller.GetById(id);

        Assert.IsType<NotFoundResult>(result);
    }

    #endregion

    #region GetByTitulo (Busca por Nome)

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public async Task GetByTitulo_DeveRetornarBadRequest_QuandoNomeInvalido(string nomeBusca)
    {
        var result = await _controller.GetByTitulo(nomeBusca);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Equal("O nome do autor para pesquisa não pode ser vazio.", badRequestResult.Value);
    }

    [Fact]
    public async Task GetByTitulo_DeveRetornarNotFound_QuandoNenhumAutorEncontrado()
    {
        var nome = "Autor Inexistente";
        _serviceMock.Setup(x => x.GetAllByNomeAsync(nome))
            .ReturnsAsync(new List<AutorDto>());
        var result = await _controller.GetByTitulo(nome);

        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.Contains(nome, notFoundResult.Value.ToString());
    }

    [Fact]
    public async Task GetByTitulo_DeveRetornarOk_QuandoEncontraAutores()
    {
        var nome = "George";
        var listaAutores = new List<AutorDto> { new() { Id = 1, Nome = "George R.R. Martin" } };

        _serviceMock.Setup(x => x.GetAllByNomeAsync(nome))
            .ReturnsAsync(listaAutores);

        var result = await _controller.GetByTitulo(nome);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnValue = Assert.IsAssignableFrom<IEnumerable<AutorDto>>(okResult.Value);
        Assert.Single(returnValue);
    }

    #endregion

    #region Update

    [Fact]
    public async Task Update_DeveRetornarNoContent_QuandoSucesso()
    {
        var id = 1;
        var dto = new CreateUpdateAutorDto { Nome = "Autor Atualizado" };

        _serviceMock.Setup(x => x.UpdateAsync(id, dto)).Returns(Task.CompletedTask);

        var result = await _controller.Update(id, dto);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Update_DeveRetornarNotFound_QuandoExcecaoKeyNotFound()
    {
        var id = 99;
        var dto = new CreateUpdateAutorDto { Nome = "Autor" };

        _serviceMock.Setup(x => x.UpdateAsync(id, dto))
            .ThrowsAsync(new KeyNotFoundException());

        var result = await _controller.Update(id, dto);

        Assert.IsType<NotFoundResult>(result);
    }

    #endregion
}