using GerenciadorGeneros.Domain.Interfaces;
using GerenciadorLivros.Domain.Entities;
using GerenciadorLivros.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace GerenciadorLivros.Infrastructure.Repositories;

public class GeneroRepository : IGeneroRepository
{
    private readonly AppDbContext _context;

    public GeneroRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Genero>> GetAllAsync()
    {
        return await _context
            .Generos
            .ToListAsync();
    }

    public async Task<IEnumerable<Genero>> GetAllByTituloAsync(string descricao)
    {
        return await _context
            .Generos
            .Where(x => x.Descricao.Contains(descricao))
            .ToListAsync();
    }

    public async Task<Genero> GetByIdAsync(int id)
    {
        return await _context
            .Generos
            .FindAsync(id);
    }


    public async Task<Genero> AddAsync(Genero entity)
    {
        await _context.Generos.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(Genero entity)
    {
        _context.Entry(entity).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            _context.Generos.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}