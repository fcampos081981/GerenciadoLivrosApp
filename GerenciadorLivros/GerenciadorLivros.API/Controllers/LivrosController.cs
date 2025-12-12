using Asp.Versioning;
using GerenciadorLivros.Application.DTOs;
using GerenciadorLivros.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GerenciadorLivros.API.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class LivrosController : ControllerBase
{
    private readonly ILivroService _service;

    public LivrosController(ILivroService livroService)
    {
        _service = livroService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet("titulo/{titulo}")]
    public async Task<ActionResult<IEnumerable<LivroDto>>> GetByTitulo(string titulo)
    {
        if (string.IsNullOrWhiteSpace(titulo)) return BadRequest("O título para pesquisa não pode ser vazio.");

        var livros = await _service.GetAllByTituloAsync(titulo);


        if (livros == null || !livros.Any()) return NotFound($"Nenhum livro encontrado contendo: '{titulo}'");

        return Ok(livros);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUpdateLivroDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id, version = "1.0" }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateUpdateLivroDto dto)
    {
        try
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}