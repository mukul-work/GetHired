import { useNavigate } from 'react-router-dom';

function BlogCard({ blog }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blogs/${blog.id}`)}
      className="cursor-pointer border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-2 mb-3">
        {blog.tags.map(tag => (
          <span key={tag} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h2>
      <p className="text-gray-500 text-sm mb-3">{blog.excerpt}</p>
      <p className="text-gray-400 text-xs">{blog.author} · {blog.batch} · {blog.branch} · {blog.readTime}</p>
    </div>
  );
}

export default BlogCard;