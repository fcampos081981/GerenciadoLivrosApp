using System.ComponentModel.DataAnnotations;

namespace GerenciadorLivros.Application.DTOs;

public class CreateUpdateLivroDto
{
    [Required(ErrorMessage = "O título do livro é obrigatório.")]
    [StringLength(200, MinimumLength = 2, ErrorMessage = "O título deve ter entre 2 e 200 caracteres.")]
    public string Titulo { get; set; }

    [Required(ErrorMessage = "O ID do Autor é obrigatório.")]
    [Range(1, int.MaxValue, ErrorMessage = "O ID do Autor deve ser maior que 0.")]
    public int AutorId { get; set; }

    [Required(ErrorMessage = "O ID do Gênero é obrigatório.")]
    [Range(1, int.MaxValue, ErrorMessage = "O ID do Gênero deve ser maior que 0.")]
    public int GeneroId { get; set; }
}