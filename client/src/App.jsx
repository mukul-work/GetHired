import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Blogs from './pages/blogs/Blogs';
import BlogPost from './pages/blogs/BlogPost';
import Home from './pages/Home';
import CompanyHome from './pages/CompanyHome';

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/blogs' element={<Blogs/>}/>
        <Route path='/blogs/:id' element={<BlogPost/>}/>
        <Route path='/companies' element={<CompanyHome/>}/>
      </Routes>
    </BrowserRouter>
  )
}

