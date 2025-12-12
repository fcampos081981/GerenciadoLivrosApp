namespace GerenciadorLivros.Domain.Entities;

public class Livro : BaseEntity
{
    public string Titulo { get; set; }

    public int AutorId { get; set; }
    public Autor Autor { get; set; }

    public int GeneroId { get; set; }
    public Genero Genero { get; set; }
}