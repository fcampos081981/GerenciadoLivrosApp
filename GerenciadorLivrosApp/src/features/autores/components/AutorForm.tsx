import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAutorStore } from '../store/useAutorStore';
import { Save, ArrowLeft } from 'lucide-react';

export const AutorForm = () => {
  const navigate = useNavigate();
  const { addAutor, isLoading } = useAutorStore();
  const [nome, setNome] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return alert("O nome é obrigatório.");

    try {
      await addAutor({ nome });
      navigate('/autores');
    } catch (error) {
      alert("Erro ao criar autor.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Novo Autor</h2>
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
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Ex: Machado de Assis"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            {isLoading ? 'Salvando...' : 'Cadastrar Autor'}
          </button>
        </div>
      </form>
    </div>
  );
};