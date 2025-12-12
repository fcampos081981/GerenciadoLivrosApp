using GerenciadorLivros.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GerenciadorLivros.Infrastructure.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Autor> Autores { get; set; }
    public DbSet<Genero> Generos { get; set; }
    public DbSet<Livro> Livros { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Livro>()
            .HasOne(l => l.Autor)
            .WithMany(a => a.Livros)
            .HasForeignKey(l => l.AutorId);

        modelBuilder.Entity<Livro>()
            .HasOne(l => l.Genero)
            .WithMany(g => g.Livros)
            .HasForeignKey(l => l.GeneroId);
    }
}