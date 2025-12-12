import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGeneroStore } from '../store/useGeneroStore';
import { Plus, Trash2, Pencil, Search, Loader2 } from 'lucide-react';

export const GeneroList = () => {
  const navigate = useNavigate();
  const { generos, isLoading, fetchGeneros, searchByDescricao, removeGenero } = useGeneroStore();
  const [termo, setTermo] = useState('');

  useEffect(() => {
    fetchGeneros();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchByDescricao(termo);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Gêneros</h2>
        <Link 
          to="/generos/novo" 
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 shadow-sm"
        >
          <Plus size={20} /> Novo Gênero
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input 
          type="text"
          placeholder="Pesquisar por descrição..."
          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
        />&nbsp;&nbsp;
        <button type="submit" className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
          <Search size={20} />
        </button>
      </form>

      {isLoading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-4 border-b w-20">ID</th>
                <th className="p-4 border-b">Descrição</th>
                <th className="p-4 border-b text-center w-32">Ações</th>
              </tr>
            </thead>
            <tbody>
              {generos.length > 0 ? (
                generos.map((genero) => (
                  <tr key={genero.id} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="p-4 text-gray-500 font-mono">#{genero.id}</td>
                    <td className="p-4 font-medium text-gray-900">{genero.descricao}</td>
                    <td className="p-4 flex justify-center gap-3">
                      <button 
                        onClick={() => navigate(`/generos/editar/${genero.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          if(confirm(`Excluir o gênero "${genero.descricao}"?`)) removeGenero(genero.id);
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    Nenhum gênero encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};