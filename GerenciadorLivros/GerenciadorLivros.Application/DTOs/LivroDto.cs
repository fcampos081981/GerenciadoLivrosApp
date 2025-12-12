namespace GerenciadorLivros.Application.DTOs;

public class LivroDto
{
    public int Id { get; set; }
    public string Titulo { get; set; }
    public int AutorId { get; set; }
    public string AutorNome { get; set; }
    public int GeneroId { get; set; }
    public string GeneroDescricao { get; set; }
}