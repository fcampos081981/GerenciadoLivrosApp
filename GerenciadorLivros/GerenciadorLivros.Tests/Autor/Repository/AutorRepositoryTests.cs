using GerenciadorLivros.Domain.Entities;
using GerenciadorLivros.Infrastructure.Context;
using GerenciadorLivros.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GerenciadorLivros.Tests.Repositories
{
    public class AutorRepositoryTests
    {
        
        private AppDbContext GetDbContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;
            
            return new AppDbContext(options);
        }

        [Fact]
        public async Task AddAsync_DeveSalvarAutorNoBanco()
        {

            var dbName = Guid.NewGuid().ToString();
            var autor = new Autor { Nome = "Autor Teste" };
 
            using (var context = GetDbContext(dbName))
            {
                var repo = new AutorRepository(context);
                await repo.AddAsync(autor);
            }

            using (var context = GetDbContext(dbName))
            {
                var autorSalvo = await context.Autores.FirstOrDefaultAsync();
                Assert.NotNull(autorSalvo);
                Assert.Equal("Autor Teste", autorSalvo.Nome);
                Assert.True(autorSalvo.Id > 0); 
            }
        }

        [Fact]
        public async Task GetAllAsync_DeveRetornarTodosOsAutores()
        {
            var dbName = Guid.NewGuid().ToString();
            using (var context = GetDbContext(dbName))
            {
                context.Autores.AddRange(
                    new Autor { Nome = "Autor A" },
                    new Autor { Nome = "Autor B" }
                );
                await context.SaveChangesAsync();
            }

            using (var context = GetDbContext(dbName))
            {
                var repo = new AutorRepository(context);
                var resultado = await repo.GetAllAsync();
                
                Assert.NotNull(resultado);
                Assert.Equal(2, resultado.Count());
            }
        }

        [Fact]
        public async Task GetAllByTituloAsync_DeveFiltrarPorNomeParcial()
        {
            
            var dbName = Guid.NewGuid().ToString();
            using (var context = GetDbContext(dbName))
            {
                context.Autores.AddRange(
                    new Autor { Nome = "A.Outro Autor" },
                    new Autor { Nome = "A.Autor XPTO" },
                    new Autor { Nome = "Autor 321" }
                );
                await context.SaveChangesAsync();
            }

            using (var context = GetDbContext(dbName))
            {
                var repo = new AutorRepository(context);

                var resultado = await repo.GetAllByTituloAsync("A."); 

                Assert.Equal(2, resultado.Count());
                Assert.Contains(resultado, a => a.Nome == "A.Outro Autor");
                Assert.Contains(resultado, a => a.Nome == "A.Autor XPTO");
                Assert.DoesNotContain(resultado, a => a.Nome == "Autor 321");
            }
        }

        [Fact]
        public async Task GetByIdAsync_DeveRetornarAutorCorreto()
        {
     
            var dbName = Guid.NewGuid().ToString();
            using (var context = GetDbContext(dbName))
            {
                context.Autores.Add(new Autor { Id = 1, Nome = "Autor qualquer" });
                await context.SaveChangesAsync();
            }
 
            using (var context = GetDbContext(dbName))
            {
                var repo = new AutorRepository(context);
                var resultado = await repo.GetByIdAsync(1);
 
                Assert.NotNull(resultado);
                Assert.Equal("Autor qualquer", resultado.Nome);
            }
        }

        [Fact]
        public async Task UpdateAsync_DeveAtualizarNomeDoAutor()
        {
 
            var dbName = Guid.NewGuid().ToString();
            using (var context = GetDbContext(dbName))
            {
                context.Autores.Add(new Autor { Id = 1, Nome = "Nome Antigo" });
                await context.SaveChangesAsync();
            }

 
            using (var context = GetDbContext(dbName))
            {
                var repo = new AutorRepository(context);
                var autorParaAtualizar = new Autor { Id = 1, Nome = "Nome Novo" };
                
                
                await repo.UpdateAsync(autorParaAtualizar);
            }

       
            using (var context = GetDbContext(dbName))
            {
                var autorAtualizado = await context.Autores.FindAsync(1);
                Assert.Equal("Nome Novo", autorAtualizado.Nome);
            }
        }

        [Fact]
        public async Task DeleteAsync_DeveRemoverAutorDoBanco()
        {
             
            var dbName = Guid.NewGuid().ToString();
            using (var context = GetDbContext(dbName))
            {
                context.Autores.Add(new Autor { Id = 1, Nome = "Para Deletar" });
                await context.SaveChangesAsync();
            }

        
            using (var context = GetDbContext(dbName))
            {
                var repo = new AutorRepository(context);
                await repo.DeleteAsync(1);
            }

            
            using (var context = GetDbContext(dbName))
            {
                var autor = await context.Autores.FindAsync(1);
                Assert.Null(autor);  
            }
        }
    }
}