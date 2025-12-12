using System.ComponentModel.DataAnnotations;

namespace GerenciadorLivros.Application.DTOs;

public class CreateUpdateGeneroDto
{
    [Required(ErrorMessage = "A descrição é obrigatório.")]
    [StringLength(200, MinimumLength = 3, ErrorMessage = "O descrição deve ter entre 3 e 200 caracteres.")]
    public string Descricao { get; set; }
}