using GerenciadorAutors.Domain.Interfaces;
using GerenciadorLivros.Domain.Entities;
using GerenciadorLivros.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace GerenciadorLivros.Infrastructure.Repositories;

public class AutorRepository : IAutorRepository
{
    private readonly AppDbContext _context;

    public AutorRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Autor>> GetAllAsync()
    {
        return await _context
            .Autores
            .ToListAsync();
    }


    public async Task<IEnumerable<Autor>> GetAllByTituloAsync(string nome)
    {
        return await _context
            .Autores
            .Where(x => x.Nome.Contains(nome))
            .ToListAsync();
    }

    public async Task<Autor> GetByIdAsync(int id)
    {
        return await _context
            .Autores
            .FindAsync(id);
    }


    public async Task<Autor> AddAsync(Autor entity)
    {
        await _context.Autores.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(Autor entity)
    {
        _context.Entry(entity).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);

        if (entity != null)
        {
            _context.Autores.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}