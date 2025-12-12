import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGeneroStore } from '../store/useGeneroStore';
import { Save, ArrowLeft } from 'lucide-react';

export const GeneroForm = () => {
  const navigate = useNavigate();
  const { addGenero, isLoading } = useGeneroStore();
  const [descricao, setDescricao] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return alert("A descrição é obrigatória.");

    try {
      await addGenero({ descricao });
      navigate('/generos');
    } catch (error) {
      alert("Erro ao criar gênero.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Novo Gênero</h2>
        <Link to="/generos" className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <ArrowLeft size={20} /> Voltar
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Ex: Ficção Científica"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            {isLoading ? 'Salvando...' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </div>
  );
};