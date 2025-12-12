using AutoMapper;
using GerenciadorGeneros.Domain.Interfaces;
using GerenciadorLivros.Application.DTOs;
using GerenciadorLivros.Application.Services;
using GerenciadorLivros.Domain.Entities;
using GerenciadorLivros.Domain.Interfaces;
using Moq;
using Xunit;

namespace GerenciadorLivros.Tests.Services
{
    public class GeneroServiceTests
    {
        private readonly Mock<IGeneroRepository> _repoMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly GeneroService _service;

        public GeneroServiceTests()
        {
            _repoMock = new Mock<IGeneroRepository>();
            _mapperMock = new Mock<IMapper>();
            _service = new GeneroService(_repoMock.Object, _mapperMock.Object);
        }

        [Fact]
        public async Task GetAllAsync_DeveRetornarListaDeGeneros()
        {
 
            var listaGeneros = new List<Genero> { new Genero { Id = 1, Descricao = "Ficção" } };
            var listaDtos = new List<GeneroDto> { new GeneroDto { Id = 1, Descricao = "Ficção" } };

            _repoMock.Setup(x => x.GetAllAsync()).ReturnsAsync(listaGeneros);
            _mapperMock.Setup(m => m.Map<IEnumerable<GeneroDto>>(listaGeneros)).Returns(listaDtos);
 
            var result = await _service.GetAllAsync();
 
            Assert.NotNull(result);
            Assert.Single(result);
            _repoMock.Verify(x => x.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task GetAllByDescricaoAsync_DeveRetornarGenerosFiltrados()
        {
 
            string termo = "Terror";
            var listaGeneros = new List<Genero> { new Genero { Id = 1, Descricao = "Terror" } };
            var listaDtos = new List<GeneroDto> { new GeneroDto { Id = 1, Descricao = "Terror" } };
 
            _repoMock.Setup(x => x.GetAllByTituloAsync(termo)).ReturnsAsync(listaGeneros);
            _mapperMock.Setup(m => m.Map<IEnumerable<GeneroDto>>(listaGeneros)).Returns(listaDtos);
 
            var result = await _service.GetAllByDescricaoAsync(termo);
 
            Assert.NotNull(result);
            Assert.Equal("Terror", result.First().Descricao);
            _repoMock.Verify(x => x.GetAllByTituloAsync(termo), Times.Once);
        }

        [Fact]
        public async Task GetByIdAsync_DeveRetornarGenero_QuandoExiste()
        {

            int id = 1;
            var genero = new Genero { Id = id, Descricao = "Drama" };
            var dto = new GeneroDto { Id = id, Descricao = "Drama" };

            _repoMock.Setup(x => x.GetByIdAsync(id)).ReturnsAsync(genero);
            _mapperMock.Setup(m => m.Map<GeneroDto>(genero)).Returns(dto);
 
            var result = await _service.GetByIdAsync(id);
 
            Assert.NotNull(result);
            Assert.Equal(id, result.Id);
        }

        [Fact]
        public async Task CreateAsync_DeveSalvarERetornarDto()
        {
    
            var createDto = new CreateUpdateGeneroDto { Descricao = "Novo Genero" };
            var entity = new Genero { Descricao = "Novo Genero" };
            var entitySalva = new Genero { Id = 10, Descricao = "Novo Genero" };
            var dtoRetorno = new GeneroDto { Id = 10, Descricao = "Novo Genero" };

            _mapperMock.Setup(m => m.Map<Genero>(createDto)).Returns(entity);
            _repoMock.Setup(r => r.AddAsync(entity)).ReturnsAsync(entitySalva);
            _mapperMock.Setup(m => m.Map<GeneroDto>(entitySalva)).Returns(dtoRetorno);
 
            var result = await _service.CreateAsync(createDto);
 
            Assert.NotNull(result);
            Assert.Equal(10, result.Id);
            _repoMock.Verify(r => r.AddAsync(It.IsAny<Genero>()), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_DeveAtualizar_QuandoGeneroExiste()
        { 
            int id = 1;
            var updateDto = new CreateUpdateGeneroDto { Descricao = "Atualizado" };
            var generoExistente = new Genero { Id = id, Descricao = "Antigo" };
 
            _repoMock.Setup(x => x.GetByIdAsync(id)).ReturnsAsync(generoExistente);
 
            await _service.UpdateAsync(id, updateDto);
 
            _mapperMock.Verify(m => m.Map(updateDto, generoExistente), Times.Once);  
            _repoMock.Verify(x => x.UpdateAsync(generoExistente), Times.Once);  
        }

        [Fact]
        public async Task UpdateAsync_DeveLancarException_QuandoGeneroNaoExiste()
        {
 
            int id = 99;
            var updateDto = new CreateUpdateGeneroDto { Descricao = "Teste" };
 
            _repoMock.Setup(x => x.GetByIdAsync(id)).ReturnsAsync((Genero)null);
 
            var exception = await Assert.ThrowsAsync<Exception>(() => _service.UpdateAsync(id, updateDto));
            
            Assert.Equal("Genero inexistente", exception.Message);
            _repoMock.Verify(x => x.UpdateAsync(It.IsAny<Genero>()), Times.Never);  
        }

        [Fact]
        public async Task DeleteAsync_DeveChamarMetodoDeleteDoRepositorio()
        {
 
            int id = 1;
 
            await _service.DeleteAsync(id); 
            
            _repoMock.Verify(x => x.DeleteAsync(id), Times.Once);
        }
    }
}