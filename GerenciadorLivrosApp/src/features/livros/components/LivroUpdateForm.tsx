import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useLivroStore } from '../store/useLivroStore';
import { livroService } from '../services/livroService'; 
import { autorService } from '../../autores/services/autorService';
import { generoService } from '../../generos/services/generoService';
import type { Autor } from '../../autores/types';
import type { Genero } from '../../generos/types';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';

export const LivroUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateLivro } = useLivroStore();


  const [titulo, setTitulo] = useState('');
  const [autorId, setAutorId] = useState<number>(0);
  const [generoId, setGeneroId] = useState<number>(0);

 
  const [autoresList, setAutoresList] = useState<Autor[]>([]);
  const [generosList, setGenerosList] = useState<Genero[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const carregarDadosCompletos = async () => {
      try {
        setIsLoading(true);


        const [livroAtual, autoresData, generosData] = await Promise.all([
          livroService.getById(Number(id)),
          autorService.getAll(),
          generoService.getAll()
        ]);


        setAutoresList(autoresData);
        setGenerosList(generosData);


        setTitulo(livroAtual.titulo);
        setAutorId(livroAtual.autorId);
        setGeneroId(livroAtual.generoId);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Não foi possível carregar os dados do livro.");
        navigate('/livros');
      } finally {
        setIsLoading(false);
      }
    };

    carregarDadosCompletos();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo || autorId === 0 || generoId === 0) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    try {
      setIsSaving(true);
      await updateLivro(Number(id), {
        titulo,
        autorId,
        generoId
      });
      navigate('/livros');
    } catch (error) {
      alert("Erro ao atualizar o livro.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p>Carregando dados do livro...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Editar Livro</h2>
        <Link to="/livros" className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <ArrowLeft size={20} /> Voltar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        

        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título:
          </label>&nbsp;&nbsp;&nbsp;
          <input
            id="titulo"
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          

          <div>
            <label htmlFor="autor" className="block text-sm font-medium text-gray-700 mb-1">
              Autor:
            </label>&nbsp;&nbsp;&nbsp;
            <select
              id="autor"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={autorId}
              onChange={(e) => setAutorId(Number(e.target.value))}
            >
              <option value={0} disabled>Selecione...</option>
              {autoresList.map((autor) => (
                <option key={autor.id} value={autor.id}>
                  {autor.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-1">
              Gênero:
            </label>&nbsp;&nbsp;&nbsp;
            <select
              id="genero"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={generoId} 
              onChange={(e) => setGeneroId(Number(e.target.value))}
            >
              <option value={0} disabled>Selecione...</option>
              {generosList.map((genero) => (
                <option key={genero.id} value={genero.id}>
                  {genero.descricao}
                </option>
              ))}
            </select>
          </div>

        </div>

     
        <div className="flex justify-end pt-4 gap-3">
          <button
            type="button"
            onClick={() => navigate('/livros')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? (
                <>Salvando...</>
            ) : (
                <>
                    <Save size={18} /> Salvar Alterações
                </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};