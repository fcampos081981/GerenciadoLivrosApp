using GerenciadorLivros.API.Controllers;
using GerenciadorLivros.Application.DTOs;
using GerenciadorLivros.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace GerenciadorLivros.Tests.Controllers
{
    public class GeneroControllerTests
    {
        private readonly Mock<IGeneroService> _serviceMock;
        private readonly GeneroController _controller;

        public GeneroControllerTests()
        {
            _serviceMock = new Mock<IGeneroService>();
   
            _controller = new GeneroController(_serviceMock.Object);
        }

        #region GetAll
        [Fact]
        public async Task GetAll_DeveRetornarOk_ComListaDeGeneros()
        {

            var generos = new List<GeneroDto> 
            { 
                new GeneroDto { Id = 1, Descricao = "Ficção" } 
            };
            _serviceMock.Setup(x => x.GetAllAsync()).ReturnsAsync(generos);

            var result = await _controller.GetAll();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsAssignableFrom<IEnumerable<GeneroDto>>(okResult.Value);
            Assert.Single(returnValue);
        }

        [Fact]
        public async Task GetAll_DeveRetornarNotFound_QuandoResultadoNulo()
        {

            _serviceMock.Setup(x => x.GetAllAsync()).ReturnsAsync((IEnumerable<GeneroDto>)null);

            var result = await _controller.GetAll();

            Assert.IsType<NotFoundResult>(result);
        }
        #endregion

        #region GetById
        [Fact]
        public async Task GetById_DeveRetornarOk_QuandoGeneroExiste()
        {

            int id = 1;
            var genero = new GeneroDto { Id = id, Descricao = "Terror" };
            _serviceMock.Setup(x => x.GetByIdAsync(id)).ReturnsAsync(genero);

            var result = await _controller.GetById(id);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<GeneroDto>(okResult.Value);
            Assert.Equal("Terror", returnValue.Descricao);
        }

        [Fact]
        public async Task GetById_DeveRetornarNotFound_QuandoGeneroNaoExiste()
        {
 
            int id = 99;
            _serviceMock.Setup(x => x.GetByIdAsync(id)).ReturnsAsync((GeneroDto)null);

            var result = await _controller.GetById(id);

            Assert.IsType<NotFoundResult>(result);
        }
        #endregion

        #region GetByTitulo (Busca por Descrição)
        [Theory]
        [InlineData("")]
        [InlineData(null)]
        [InlineData("   ")]
        public async Task GetByTitulo_DeveRetornarBadRequest_QuandoDescricaoInvalida(string descricao)
        {
    
            var result = await _controller.GetByTitulo(descricao);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("O genero para pesquisa não pode ser vazio.", badRequestResult.Value);
        }

        [Fact]
        public async Task GetByTitulo_DeveRetornarNotFound_QuandoListaVazia()
        {

            string descricao = "Romance";
            _serviceMock.Setup(x => x.GetAllByDescricaoAsync(descricao))
                        .ReturnsAsync(new List<GeneroDto>());  


            var result = await _controller.GetByTitulo(descricao);

            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Contains(descricao, notFoundResult.Value.ToString());
        }

        [Fact]
        public async Task GetByTitulo_DeveRetornarOk_QuandoEncontraGeneros()
        {
            string descricao = "Aventura";
            var lista = new List<GeneroDto> { new GeneroDto { Id = 1, Descricao = "Aventura" } };
            
            _serviceMock.Setup(x => x.GetAllByDescricaoAsync(descricao))
                        .ReturnsAsync(lista);

            var result = await _controller.GetByTitulo(descricao);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsAssignableFrom<IEnumerable<GeneroDto>>(okResult.Value);
            Assert.Single(returnValue);
        }
        #endregion

        #region Create
        [Fact]
        public async Task Create_DeveRetornarCreatedAtAction()
        {
            var inputDto = new CreateUpdateGeneroDto { Descricao = "Novo Gênero" };
            var outputDto = new GeneroDto { Id = 1, Descricao = "Novo Gênero" };

            _serviceMock.Setup(x => x.CreateAsync(inputDto)).ReturnsAsync(outputDto);

            var result = await _controller.Create(inputDto);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal("GetById", createdResult.ActionName);
            Assert.Equal(1, createdResult.RouteValues["id"]);
            Assert.Equal(outputDto, createdResult.Value);
        }
        #endregion

        #region Update
        [Fact]
        public async Task Update_DeveRetornarNoContent_QuandoSucesso()
        {

            int id = 1;
            var dto = new CreateUpdateGeneroDto { Descricao = "Atualizado" };
            
            _serviceMock.Setup(x => x.UpdateAsync(id, dto)).Returns(Task.CompletedTask);

            var result = await _controller.Update(id, dto);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Update_DeveRetornarNotFound_QuandoExcecaoKeyNotFound()
        {

            int id = 99;
            var dto = new CreateUpdateGeneroDto { Descricao = "Erro" };

            _serviceMock.Setup(x => x.UpdateAsync(id, dto))
                        .ThrowsAsync(new KeyNotFoundException());

            var result = await _controller.Update(id, dto);

            Assert.IsType<NotFoundResult>(result);
        }
        #endregion

        #region Delete
        [Fact]
        public async Task Delete_DeveRetornarNoContent()
        {

            int id = 1;
            _serviceMock.Setup(x => x.DeleteAsync(id)).Returns(Task.CompletedTask);

            var result = await _controller.Delete(id);

            Assert.IsType<NoContentResult>(result);
        }
        #endregion
    }
}