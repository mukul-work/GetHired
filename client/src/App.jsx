import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Blogs from './pages/blogs/Blogs';
import BlogPost from './pages/blogs/BlogPost';

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/blogs' element={<Blogs/>}/>
        <Route path='/blogs/:id' element={<BlogPost/>}/>
      </Routes>
    </BrowserRouter>
  )
}