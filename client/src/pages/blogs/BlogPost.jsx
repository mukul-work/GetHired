import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import blogs from '../../data/blogs.js';

function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogs.find(b => b.id === Number(id));

  if (!blog) return <div className="text-center mt-20 text-gray-500">Blog not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate('/blogs')}
        className="text-blue-500 text-sm mb-6 hover:underline"
      >
        ← Back to Blogs
      </button>
      <div className="flex gap-2 mb-4">
        {blog.tags.map(tag => (
          <span key={tag} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-3">{blog.title}</h1>
      <p className="text-gray-400 text-sm mb-8">
        {blog.author} · {blog.batch} · {blog.branch} · {blog.company} · {blog.date} · {blog.readTime}
      </p>
      <p className="text-gray-700 leading-relaxed">{blog.excerpt}</p>
    </div>
  );
}

export default BlogPost;