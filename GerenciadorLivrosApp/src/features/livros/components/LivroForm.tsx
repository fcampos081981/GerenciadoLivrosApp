import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLivroStore } from '../store/useLivroStore';
import { Save, ArrowLeft } from 'lucide-react';

import { autorService } from '../../autores/services/autorService'; 
import { generoService } from '../../generos/services/generoService';

interface SelectOption {
  id: number;
  label: string;
}

export const LivroForm = () => {
  const navigate = useNavigate();
  const { addLivro, isLoading } = useLivroStore();

  const [titulo, setTitulo] = useState('');
  const [autorId, setAutorId] = useState<number | string>(''); 
  const [generoId, setGeneroId] = useState<number | string>('');


  const [autoresOpcoes, setAutoresOpcoes] = useState<SelectOption[]>([]);
  const [generosOpcoes, setGenerosOpcoes] = useState<SelectOption[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);


  useEffect(() => {
    const carregarDependencias = async () => {
      try {
 
        const [autoresData, generosData] = await Promise.all([
          autorService.getAll(),
          generoService.getAll()
        ]);

        setAutoresOpcoes(autoresData.map((a: any) => ({ id: a.id, label: a.nome })));
        setGenerosOpcoes(generosData.map((g: any) => ({ id: g.id, label: g.descricao })));
      } catch (error) {
        console.error("Erro ao carregar listas:", error);
        alert("Erro ao carregar autores ou gêneros. Verifique a API.");
      } finally {
        setIsLoadingData(false);
      }
    };

    carregarDependencias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo || !autorId || !generoId) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await addLivro({
        titulo,
        autorId: Number(autorId),
        generoId: Number(generoId)
      });
      

      navigate('/livros');
    } catch (error) {
      alert("Erro ao salvar livro.");
    }
  };

  if (isLoadingData) {
    return <div className="p-8 text-center text-gray-500">Carregando formulário...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Novo Livro</h2>
        <Link to="/livros" className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <ArrowLeft size={20} /> Voltar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título do Livro:
          </label>&nbsp;&nbsp;&nbsp;
          <input
            id="titulo"
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Ex: O Calculo Com Geometria Analitica Vol 1 3 Ed Louis Leithold"
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              value={autorId}
              onChange={(e) => setAutorId(e.target.value)}
            >
              <option value="" disabled>Selecione um autor...</option>
              {autoresOpcoes.map((autor) => (
                <option key={autor.id} value={autor.id}>
                  {autor.label}
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              value={generoId}
              onChange={(e) => setGeneroId(e.target.value)}
            >
              <option value="" disabled>Selecione um gênero...</option>
              {generosOpcoes.map((genero) => (
                <option key={genero.id} value={genero.id}>
                  {genero.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => navigate('/livros')}
            className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {isLoading ? 'Salvando...' : 'Salvar Livro'}
          </button>
        </div>

      </form>
    </div>
  );
};