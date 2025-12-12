import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAutorStore } from '../store/useAutorStore';
import { Plus, Trash2, Pencil, Search, Loader2 } from 'lucide-react';

export const AutorList = () => {
  const navigate = useNavigate();
  const { autores, isLoading, fetchAutores, searchByNome, removeAutor } = useAutorStore();

  const [termoBusca, setTermoBusca] = useState('');

  useEffect(() => {
    fetchAutores();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchByNome(termoBusca);
  };

  const handleDelete = (id: number, nome: string) => {
    if (confirm(`Deseja realmente excluir o autor "${nome}"?`)) {
      removeAutor(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Autores</h2>
        <Link 
          to="/autores/novo" 
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 shadow-sm"
        >
          <Plus size={20} /> Novo Autor
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <input 
            type="text"
            placeholder="Pesquisar autor por nome..."
            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />&nbsp;&nbsp;
           <button 
          type="submit" 
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
        >
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </button>
        </div>
       
      </form>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-4 border-b w-20">ID</th>
                <th className="p-4 border-b w-full">Nome</th>
                <th className="p-4 border-b text-center min-w-[150px]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {autores.length > 0 ? (
                autores.map((autor) => (
                  <tr key={autor.id} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="p-4 text-gray-500 font-mono">#{autor.id}</td>
                    <td className="p-4 font-medium text-gray-900">{autor.nome}</td>
                    <td className="p-4 flex justify-center gap-3">
                      <button 
                        onClick={() => navigate(`/autores/editar/${autor.id}`)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(autor.id, autor.nome)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="text-gray-300" />
                      <p>Nenhum autor encontrado.</p>
                      {termoBusca && (
                        <button 
                          onClick={() => { setTermoBusca(''); fetchAutores(); }} 
                          className="text-blue-500 hover:underline text-sm"
                        >
                          Limpar filtro
                        </button>
                      )}
                    </div>
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