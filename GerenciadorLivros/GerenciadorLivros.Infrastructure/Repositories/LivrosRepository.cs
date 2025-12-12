using GerenciadorLivros.Domain.Entities;
using GerenciadorLivros.Domain.Interfaces;
using GerenciadorLivros.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace GerenciadorLivros.Infrastructure.Repositories;

public class LivrosRepository : ILivrosRepository
{
    private readonly AppDbContext _context;

    public LivrosRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Livro>> GetAllAsync()
    {
        return await _context
            .Livros
            .Include(x => x.Autor)
            .Include(x => x.Genero)
            .ToListAsync();
    }

    public async Task<IEnumerable<Livro>> GetAllByTituloAsync(string titulo)
    {
        return await _context
            .Livros
            .Include(x => x.Autor)
            .Include(x => x.Genero)
            .Where(x => x.Titulo.Contains(titulo))
            .ToListAsync();
    }

    public async Task<Livro> GetByIdAsync(int id)
    {
        return await _context
            .Livros
            .Include(x => x.Autor)
            .Include(x => x.Genero)
            .Where(x => x.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<Livro> AddAsync(Livro entity)
    {
        await _context.Livros.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(Livro entity)
    {
        _context.Entry(entity).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            _context.Livros.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}