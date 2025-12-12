using AutoMapper;
using GerenciadorLivros.Application.DTOs;
using GerenciadorLivros.Domain.Entities;

namespace GerenciadorLivros.Application.Mappins;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Autor, AutorDto>().ReverseMap();
        CreateMap<Genero, GeneroDto>().ReverseMap();

        CreateMap<Livro, LivroDto>()
            .ForMember(dest => dest.AutorNome, opt => opt.MapFrom(src => src.Autor.Nome))
            .ForMember(dest => dest.GeneroDescricao, opt => opt.MapFrom(src => src.Genero.Descricao));
        CreateMap<Livro, LivroDto>().ReverseMap();
        
        CreateMap<CreateUpdateAutorDto, Autor>().ReverseMap();
        CreateMap<CreateUpdateGeneroDto, Genero>().ReverseMap();
        CreateMap<CreateUpdateLivroDto, Livro>().ReverseMap();
    }
}