using Asp.Versioning;
using GerenciadorLivros.Application.DTOs;
using GerenciadorLivros.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GerenciadorLivros.API.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class AutorController : ControllerBase
{
    private readonly IAutorService _service;

    public AutorController(IAutorService autorService)
    {
        _service = autorService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AutorDto>>> GetAllAsync()
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


    [HttpGet("nome/{nome}")]
    public async Task<ActionResult<IEnumerable<LivroDto>>> GetByTitulo(string nome)
    {
        if (string.IsNullOrWhiteSpace(nome)) return BadRequest("O nome do autor para pesquisa não pode ser vazio.");

        var autor = await _service.GetAllByNomeAsync(nome);


        if (autor == null || !autor.Any()) return NotFound($"Nenhum autor encontrado contendo: '{nome}'");

        return Ok(autor);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUpdateAutorDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id, version = "1.0" }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateUpdateAutorDto dto)
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