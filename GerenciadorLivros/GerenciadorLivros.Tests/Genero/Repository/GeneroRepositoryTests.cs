using GerenciadorLivros.Domain.Entities;
using GerenciadorLivros.Infrastructure.Context;
using GerenciadorLivros.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GerenciadorLivros.Tests.Repositories
{
    public class GeneroRepositoryTests
    {

        private AppDbContext GetDbContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;
            
            return new AppDbContext(options);
        }

        [Fact]
        public async Task AddAsync_DeveSalvarGeneroNoBanco()
        {

            var dbName = Guid.NewGuid().ToString();
            var genero = new Genero { Descricao = "Terror" };

            using (var context = GetDbContext(dbName))
            {
                var repo = new GeneroRepository(context);
                await repo.AddAsync(genero);
            }
  
            using (var context = GetDbContext(dbName))
            {
                var generoSalvo = await context.Generos.FirstOrDefaultAsync();
                Assert.NotNull(generoSalvo);
                Assert.Equal("Terror", generoSalvo.Descricao);
                Assert.True(generoSalvo.Id > 0);  
            }
        }

        [Fact]
        public async Task GetAllAsync_DeveRetornarTodosGeneros()
        {
 
            var dbName = Guid.NewGuid().ToString();
            using (var context = GetDbContext(dbName))
            {
                context.Generos.AddRange(
                    new Genero { Descricao = "Ficção" },
                    new Genero { Descricao = "Romance" }
                );
                await context.SaveChangesAsync();
            }
 
            using (var context = GetDbContext(dbName))
            {
                var repo = new GeneroRepository(context);
                var resultado = await repo.GetAllAsync();
 
                Assert.Equal(2, resultado.Count());
            }
        }

        [Fact]
        public async Task GetAllByTituloAsync_DeveFiltrarPorDescricao()
        {
 
            var dbName = Guid.NewGuid().ToString();
            using (var context = GetDbContext(dbName))
            {
                context.Generos.AddRange(
                    new Genero { Descricao = "Ficção Científica" },
                    new Genero { Descricao = "Ficção Histórica" },
                    new Genero { Descricao = "Biografia" }
                );
                await context.SaveChangesAsync();
            }
 
            using (var context = GetDbContext(dbName))
            {
                var repo = new GeneroRepository(context);
 
                var resultado = await repo.GetAllByTituloAsync("Ficção");

 
                Assert.Equal(2, resultado.Count());
                Assert.Contains(resultado, g => g.Descricao == "Ficção Científica");
                Assert.Contains(resultado, g => g.Descricao == "Ficção Histórica");
                Assert.DoesNotContain(resultado, g => g.Descricao == "Biografia");
            }
        }

        [Fact]
        public async Task GetByIdAsync_DeveRetornarGeneroCorreto()
        {
 
            var dbName = Guid.NewGuid().ToString();
            using (var context = GetDbContext(dbName))
            {
                context.Generos.Add(new Genero { Id = 10, Descricao = "Suspense" });
                await context.SaveChangesAsync();
            }

 
            using (var context = GetDbContext(dbName))
            {
                var repo = new GeneroRepository(context);
                var resultado = await repo.GetByIdAsync(10);
 
                Assert.NotNull(resultado);
                Assert.Equal("Suspense", resultado.Descricao);
            }
        }

        [Fact]
        public async Task UpdateAsync_DeveAtualizarDescricao()
        {
 
            var dbName = Guid.NewGuid().ToString();
            using (var context = GetDbContext(dbName))
            {
                context.Generos.Add(new Genero { Id = 1, Descricao = "Descricao Antiga" });
                await context.SaveChangesAsync();
            }
 
            using (var context = GetDbContext(dbName))
            {
                var repo = new GeneroRepository(context);
 
                var generoParaAtualizar = new Genero { Id = 1, Descricao = "Descricao Nova" };
                
                await repo.UpdateAsync(generoParaAtualizar);
            }

 
            using (var context = GetDbContext(dbName))
            {
                var generoAtualizado = await context.Generos.FindAsync(1);
                Assert.Equal("Descricao Nova", generoAtualizado.Descricao);
            }
        }

        [Fact]
        public async Task DeleteAsync_DeveRemoverGenero()
        {
 
            var dbName = Guid.NewGuid().ToString();
            using (var context = GetDbContext(dbName))
            {
                context.Generos.Add(new Genero { Id = 5, Descricao = "Para Deletar" });
                await context.SaveChangesAsync();
            }
 
            using (var context = GetDbContext(dbName))
            {
                var repo = new GeneroRepository(context);
                await repo.DeleteAsync(5);
            }
 
            using (var context = GetDbContext(dbName))
            {
                var genero = await context.Generos.FindAsync(5);
                Assert.Null(genero);  
            }
        }
    }
}