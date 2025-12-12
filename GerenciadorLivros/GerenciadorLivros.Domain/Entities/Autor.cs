namespace GerenciadorLivros.Domain.Entities;

public class Autor : BaseEntity
{
    public string Nome { get; set; }
    public ICollection<Livro> Livros { get; set; }
}