using System.ComponentModel.DataAnnotations;

namespace GerenciadorLivros.Application.DTOs;

public class CreateUpdateAutorDto
{
    [Required(ErrorMessage = "O nome do autor é obrigatório.")]
    [StringLength(200, MinimumLength = 3, ErrorMessage = "O nome do autor ter entre 3 e 200 caracteres.")]
    public string Nome { get; set; }
}