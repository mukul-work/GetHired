import { useNavigate } from 'react-router-dom';
import blogs from '../../data/blogs.js';

function BlogsPreview() {
  const navigate = useNavigate();
  const preview = blogs.slice(0, 3);

  return (
    <div className="px-8 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Latest Blogs</h2>
        <button
          onClick={() => navigate('/blogs')}
          className="text-blue-500 text-sm hover:underline"
        >
          View all →
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {preview.map(blog => (
          <div
            key={blog.id}
            onClick={() => navigate(`/blogs/${blog.id}`)}
            className="cursor-pointer border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
          >
            <div className="flex gap-2 mb-3">
              {blog.tags.map(tag => (
                <span key={tag} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{blog.title}</h3>
            <p className="text-gray-500 text-sm mb-3">{blog.excerpt}</p>
            <p className="text-gray-400 text-xs">{blog.author} · {blog.readTime}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogsPreview;