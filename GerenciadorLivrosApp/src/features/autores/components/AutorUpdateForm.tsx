import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAutorStore } from '../store/useAutorStore';
import { autorService } from '../services/autorService'; 
import { Save, ArrowLeft, Loader2 } from 'lucide-react';

export const AutorUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateAutor } = useAutorStore();

  const [nome, setNome] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    if (!id) return;

    const fetchDados = async () => {
      try {
        setIsLoadingData(true);
        const autor = await autorService.getById(Number(id));
        setNome(autor.nome);
      } catch (error) {
        console.error("Autor não encontrado", error);
        alert("Autor não encontrado.");
        navigate('/autores');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDados();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return alert("O nome é obrigatório.");

    try {
      setIsSaving(true);
      await updateAutor(Number(id), { nome });
      navigate('/autores');
    } catch (error) {
      alert("Erro ao atualizar autor.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center mt-10 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Carregando dados...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Editar Autor #{id}</h2>
        <Link to="/autores" className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <ArrowLeft size={20} /> Voltar
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Autor:
          </label>&nbsp;&nbsp;&nbsp;
          <input
            id="nome"
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={isSaving}
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};