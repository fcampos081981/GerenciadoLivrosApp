namespace GerenciadorLivros.Domain.Entities;

public class Genero : BaseEntity
{
    public string Descricao { get; set; }
    public ICollection<Livro> Livros { get; set; }
}