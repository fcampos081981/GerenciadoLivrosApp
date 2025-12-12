import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../../components/Layout/MainLayout';
//
import { LivroList } from '../../features/livros/components/LivroList';
import { LivroForm } from '../../features/livros/components/LivroForm';
import { LivroUpdateForm } from '../../features/livros/components/LivroUpdateForm';
//
import { AutorList } from '../../features/autores/components/AutorList';
import { AutorForm } from '../../features/autores/components/AutorForm';
import { AutorUpdateForm } from '../../features/autores/components/AutorUpdateForm';
//
import { GeneroList } from '../../features/generos/components/GeneroList';
import { GeneroForm } from '../../features/generos/components/GeneroForm';
import { GeneroUpdateForm } from '../../features/generos/components/GeneroUpdateForm';



export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/livros" replace />} />
          <Route path="livros" element={<LivroList />} />
          <Route path="livros/novo" element={<LivroForm />} />
          <Route path="livros/editar/:id" element={<LivroUpdateForm />} />

          <Route path="autores" element={<AutorList />} />
          <Route path="autores/novo" element={<AutorForm />} />
          <Route path="autores/editar/:id" element={<AutorUpdateForm />} />
          
          <Route path="generos" element={<GeneroList />} />
          <Route path="generos/novo" element={<GeneroForm />} />
          <Route path="generos/editar/:id" element={<GeneroUpdateForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};