import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGeneroStore } from '../store/useGeneroStore';
import { generoService } from '../services/generoService'; 
import { Save, ArrowLeft, Loader2 } from 'lucide-react';

export const GeneroUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateGenero } = useGeneroStore();

  const [descricao, setDescricao] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDados = async () => {
      try {
        setIsLoadingData(true);
        const genero = await generoService.getById(Number(id));
        setDescricao(genero.descricao);
      } catch (error) {
        alert("Gênero não encontrado.");
        navigate('/generos');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDados();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return alert("Descrição obrigatória.");

    try {
      setIsSaving(true);
      await updateGenero(Number(id), { descricao });
      navigate('/generos');
    } catch (error) {
      alert("Erro ao atualizar.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingData) {
    return <div className="flex justify-center mt-10"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Editar Gênero #{id}</h2>
        <Link to="/generos" className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <ArrowLeft size={20} /> Voltar
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            disabled={isSaving}
          />
        </div>

        <div className="flex justify-end">
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