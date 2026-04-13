import { useNavigate } from "react-router-dom";

function BlogCard({ blog }) {
  const navigate = useNavigate();
  const id = blog._id || blog.id;

  return (
    <div
      onClick={() => navigate(`/blogs/${id}`)}
      className="cursor-pointer bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-2 mb-3 flex-wrap">
        {(blog.tags || []).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
      <h2 className="text-lg font-bold text-gray-800 mb-2 leading-snug">
        {blog.title}
      </h2>
      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-xs">
          {blog.author} · {blog.batch} · {blog.branch}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{blog.readTime}</span>
          <span className="text-yellow-600 font-medium">Read →</span>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
