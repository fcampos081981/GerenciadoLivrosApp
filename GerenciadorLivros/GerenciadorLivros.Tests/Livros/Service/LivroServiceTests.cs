using AutoMapper;
using GerenciadorLivros.Application.DTOs;
using GerenciadorLivros.Application.Services;
using GerenciadorLivros.Domain.Entities;
using GerenciadorLivros.Domain.Interfaces;
using Moq;

namespace GerenciadorLivros.Tests.Services
{
    public class LivroServiceTests
    {
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<ILivrosRepository> _repoMock;
        private readonly LivroService _service;

        public LivroServiceTests()
        {
            _repoMock = new Mock<ILivrosRepository>();
            _mapperMock = new Mock<IMapper>();
            _service = new LivroService(_repoMock.Object, _mapperMock.Object);
        }

        [Fact]
        public async Task CreateAsync_ChamarRepositorio_E_RetornarDto()
        {
            var inputDto = new CreateUpdateLivroDto { Titulo = "Livro Teste 1", AutorId = 1, GeneroId = 1 };
            var livroEntity = new Livro { Id = 1, Titulo = "Livro Teste 1" };
            var outputDto = new LivroDto { Id = 1, Titulo = "Livro Teste 1" };

            _mapperMock.Setup(m => m.Map<Livro>(inputDto)).Returns(livroEntity);
            _repoMock.Setup(r => r.AddAsync(livroEntity)).ReturnsAsync(livroEntity);
            _mapperMock.Setup(m => m.Map<LivroDto>(livroEntity)).Returns(outputDto);

            var result = await _service.CreateAsync(inputDto);

            Assert.NotNull(result);
            Assert.Equal(outputDto.Id, result.Id);
            _repoMock.Verify(r => r.AddAsync(It.IsAny<Livro>()), Times.Once);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnListOfDtos()
        {
            var livros = new List<Livro> { new() { Id = 1, Titulo = "Livro 1" } };
            var livrosDto = new List<LivroDto> { new() { Id = 1, Titulo = "Livro 1" } };

            _repoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(livros);
            _mapperMock.Setup(m => m.Map<IEnumerable<LivroDto>>(livros)).Returns(livrosDto);

            var result = await _service.GetAllAsync();

            Assert.NotNull(result);
            Assert.Single(result);
            _repoMock.Verify(r => r.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task GetAllByTituloAsync_ShouldReturnListOfDtos_WhenTitleMatches()
        {
            var titulo = "Teste";
            var livros = new List<Livro> { new() { Id = 1, Titulo = "Teste Livro" } };
            var livrosDto = new List<LivroDto> { new() { Id = 1, Titulo = "Teste Livro" } };

            _repoMock.Setup(r => r.GetAllByTituloAsync(titulo)).ReturnsAsync(livros);
            _mapperMock.Setup(m => m.Map<IEnumerable<LivroDto>>(livros)).Returns(livrosDto);

            var result = await _service.GetAllByTituloAsync(titulo);

            Assert.NotNull(result);
            Assert.Single(result);
            _repoMock.Verify(r => r.GetAllByTituloAsync(titulo), Times.Once);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnDto_WhenLivroExists()
        {
            var id = 1;
            var livro = new Livro { Id = id, Titulo = "Livro 1" };
            var livroDto = new LivroDto { Id = id, Titulo = "Livro 1" };

            _repoMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(livro);
            _mapperMock.Setup(m => m.Map<LivroDto>(livro)).Returns(livroDto);

            var result = await _service.GetByIdAsync(id);

            Assert.NotNull(result);
            Assert.Equal(id, result.Id);
            _repoMock.Verify(r => r.GetByIdAsync(id), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdate_WhenLivroExists()
        {
            var id = 1;
            var updateDto = new CreateUpdateLivroDto { Titulo = "Updated Title", AutorId = 1, GeneroId = 1 };
            var existingLivro = new Livro { Id = id, Titulo = "Old Title" };

            _repoMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(existingLivro);

            await _service.UpdateAsync(id, updateDto);

            _mapperMock.Verify(m => m.Map(updateDto, existingLivro), Times.Once);
            _repoMock.Verify(r => r.UpdateAsync(existingLivro), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ShouldThrowException_WhenLivroDoesNotExist()
        {
            var id = 1;
            var updateDto = new CreateUpdateLivroDto { Titulo = "Titulo atualizar" };

            _repoMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Livro)null);

            var exception = await Assert.ThrowsAsync<Exception>(() => _service.UpdateAsync(id, updateDto));
            Assert.Equal("Livro não encontrado", exception.Message);
            _repoMock.Verify(r => r.UpdateAsync(It.IsAny<Livro>()), Times.Never);
        }

        [Fact]
        public async Task DeleteAsync_ShouldCallDeleteOnRepository()
        {
            var id = 1;

            await _service.DeleteAsync(id);

            _repoMock.Verify(r => r.DeleteAsync(id), Times.Once);
        }
    }
}