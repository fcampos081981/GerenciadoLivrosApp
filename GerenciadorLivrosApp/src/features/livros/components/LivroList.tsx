import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLivroStore } from '../store/useLivroStore';
import { Plus, Trash2, Pencil, Search, Loader2 } from 'lucide-react';

export const LivroList = () => {
  const navigate = useNavigate();
  const { livros, isLoading, fetchLivros, filterLivrosByTitulo, removeLivro } = useLivroStore();
  const [termoBusca, setTermoBusca] = useState('');

  useEffect(() => {
    fetchLivros();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterLivrosByTitulo(termoBusca);
  };

  const handleDelete = (id: number, titulo: string) => {
    if (confirm(`Tem certeza que deseja excluir o livro "${titulo}"?`)) {
      removeLivro(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Livros</h2>
        <Link
          to="/livros/novo"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 shadow-sm"
        >
          <Plus size={20} /> Novo Livro
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Pesquisar livro pelo título..."
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
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-4 border-b w-16">ID</th>
                <th className="p-4 border-b">Título</th>
                <th className="p-4 border-b">Autor</th>
                <th className="p-4 border-b">Gênero</th>
                <th className="p-4 border-b text-center min-w-[150px]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {livros.length > 0 ? (
                livros.map((livro) => (
                  <tr key={livro.id} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="p-4 text-gray-500 font-mono">#{livro.id}</td>
                    <td className="p-4 font-bold text-gray-800">{livro.titulo}</td>

                    <td className="p-4 text-gray-600">{livro.autorNome || 'N/A'}</td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {livro.generoDescricao || 'N/A'}
                      </span>
                    </td>

                    <td className="p-4 flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/livros/editar/${livro.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(livro.id, livro.titulo)}
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
                  <td colSpan={5} className="p-10 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="text-gray-300" />
                      <p>Nenhum livro encontrado.</p>
                      {termoBusca && (
                        <button
                          onClick={() => { setTermoBusca(''); fetchLivros(); }}
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