using GerenciadorLivros.Domain.Entities;
using GerenciadorLivros.Infrastructure.Context;
using GerenciadorLivros.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace GerenciadorLivros.Tests.Repositories;

public class LivrosRepositoryTests
{
    private AppDbContext GetDbContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(dbName)
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task AddAsync_DeveAdicionarLivroNoBanco()
    {
        var dbName = Guid.NewGuid().ToString();
        var livro = new Livro { Titulo = "Livro Teste", AutorId = 1, GeneroId = 1 };


        using (var context = GetDbContext(dbName))
        {
            var repo = new LivrosRepository(context);
            await repo.AddAsync(livro);
        }


        using (var context = GetDbContext(dbName))
        {
            var livroSalvo = await context.Livros.FirstOrDefaultAsync();
            Assert.NotNull(livroSalvo);
            Assert.Equal("Livro Teste", livroSalvo.Titulo);
            Assert.True(livroSalvo.Id > 0);
        }
    }

    [Fact]
    public async Task GetAllAsync_DeveRetornarTodosLivros()
    {
        var dbName = Guid.NewGuid().ToString();
        using (var context = GetDbContext(dbName))
        {
            context.Livros.AddRange(
                new Livro { Titulo = "Livro A", AutorId = 1, GeneroId = 1 },
                new Livro { Titulo = "Livro B", AutorId = 1, GeneroId = 1 }
            );
            await context.SaveChangesAsync();
        }


        using (var context = GetDbContext(dbName))
        {
            var repo = new LivrosRepository(context);
            var resultado = await repo.GetAllAsync();


            Assert.Equal(2, resultado.Count());
        }
    }

    [Fact]
    public async Task GetAllByTituloAsync_DeveFiltrarCorretamente()
    {
        var dbName = Guid.NewGuid().ToString();
        using (var context = GetDbContext(dbName))
        {
            context.Livros.AddRange(
                new Livro { Titulo = "Titulo qualquer 1", AutorId = 1, GeneroId = 1 },
                new Livro { Titulo = "Titulo qualquer 2", AutorId = 1, GeneroId = 1 },
                new Livro { Titulo = "Outro titulo qualquer", AutorId = 1, GeneroId = 1 }
            );
            await context.SaveChangesAsync();
        }


        using (var context = GetDbContext(dbName))
        {
            var repo = new LivrosRepository(context);
            var resultado = await repo.GetAllByTituloAsync("Titulo");


            Assert.Equal(2, resultado.Count());
            Assert.DoesNotContain(resultado, l => l.Titulo == "Outro titulo qualquer");
        }
    }

    [Fact]
    public async Task UpdateAsync_DeveAtualizarDados()
    {
        var dbName = Guid.NewGuid().ToString();
        var livroInicial = new Livro { Id = 1, Titulo = "Titulo Antigo", AutorId = 1, GeneroId = 1 };

        using (var context = GetDbContext(dbName))
        {
            context.Livros.Add(livroInicial);
            await context.SaveChangesAsync();
        }


        using (var context = GetDbContext(dbName))
        {
            var repo = new LivrosRepository(context);
            var livroParaAtualizar = new Livro { Id = 1, Titulo = "Titulo Novo", AutorId = 1, GeneroId = 1 };

            await repo.UpdateAsync(livroParaAtualizar);
        }


        using (var context = GetDbContext(dbName))
        {
            var livroAtualizado = await context.Livros.FindAsync(1);
            Assert.Equal("Titulo Novo", livroAtualizado.Titulo);
        }
    }

    [Fact]
    public async Task DeleteAsync_DeveRemoverDoBanco()
    {
        var dbName = Guid.NewGuid().ToString();
        using (var context = GetDbContext(dbName))
        {
            context.Livros.Add(new Livro { Id = 1, Titulo = "Para Deletar", AutorId = 1, GeneroId = 1 });
            await context.SaveChangesAsync();
        }


        using (var context = GetDbContext(dbName))
        {
            var repo = new LivrosRepository(context);
            await repo.DeleteAsync(1);
        }


        using (var context = GetDbContext(dbName))
        {
            var livro = await context.Livros.FindAsync(1);
            Assert.Null(livro);
        }
    }
}