import { Link, Outlet, useLocation } from 'react-router-dom';
import { Book, Users, Tag, Library } from 'lucide-react';

export const MainLayout = () => {
  const location = useLocation();
  const getLinkClass = (path: string) => {
    const isActive = location.pathname.startsWith(path);
    return `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
      isActive 
        ? 'bg-slate-900 text-blue-400 font-semibold' 
        : 'hover:bg-slate-700 hover:text-white text-slate-300'
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-slate-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center h-16 justify-between">
            <div className="flex items-center gap-2 font-bold text-xl">
              <Library className="text-blue-400" />
              <span>Gerenciador<span className="text-blue-400">Livros</span></span>
            </div>
            <div className="flex space-x-4">
              
              <Link to="/livros" className={getLinkClass('/livros')}>
                <Book size={18} />
                <span>Livros</span>
              </Link>&nbsp;|&nbsp;
              <Link to="/autores" className={getLinkClass('/autores')}>
                <Users size={18} />
                <span>Autores</span>
              </Link>&nbsp;|&nbsp;
              <Link to="/generos" className={getLinkClass('/generos')}>
                <Tag size={18} />
                <span>Gêneros</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        <Outlet />
      </main>
      <footer className="bg-slate-900 text-slate-400 text-center py-4 text-sm mt-auto">
        <p>© 2025 Gerenciador de Livros. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};