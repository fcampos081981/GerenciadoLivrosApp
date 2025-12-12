using Asp.Versioning;
using GerenciadorLivros.Application.DTOs;
using GerenciadorLivros.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GerenciadorLivros.API.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class GeneroController : ControllerBase
{
    private readonly IGeneroService _service;

    public GeneroController(IGeneroService generoService)
    {
        _service = generoService;
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

    [HttpGet("genero/{descricao}")]
    public async Task<ActionResult<IEnumerable<LivroDto>>> GetByTitulo(string descricao)
    {
        if (string.IsNullOrWhiteSpace(descricao)) return BadRequest("O genero para pesquisa não pode ser vazio.");

        var genero = await _service.GetAllByDescricaoAsync(descricao);


        if (genero == null || !genero.Any()) return NotFound($"Nenhum genero encontrado contendo: '{descricao}'");

        return Ok(genero);
    }


    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUpdateGeneroDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id, version = "1.0" }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateUpdateGeneroDto dto)
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