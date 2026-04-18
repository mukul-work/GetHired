import { useNavigate } from "react-router-dom";

function BlogCard({ blog, isAdmin = false, onEdit, onDelete }) {
  const navigate = useNavigate();
  const id = blog._id || blog.id;

  return (
    <div className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:shadow-md transition-shadow group">
      {/* Admin action buttons — pencil + trash */}
      {isAdmin && (
        <div
          className="absolute top-3.5 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Edit */}
          <button
            title="Edit blog"
            onClick={() => onEdit && onEdit(blog)}
            className="p-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-800/40 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 0l.172.172a2 2 0 010 2.828L12 16H9v-3z" />
            </svg>
          </button>
          {/* Delete */}
          <button
            title="Delete blog"
            onClick={() => onDelete && onDelete(blog)}
            className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/40 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}

      {/* Clickable blog content */}
      <div
        onClick={() => navigate(`/blogs/${id}`)}
        className="cursor-pointer"
      >
        <div className="flex gap-2 mb-3 flex-wrap">
          {(blog.tags || []).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2.5 py-1 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 leading-snug pr-16">
          {blog.title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {blog.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-gray-400 dark:text-gray-500 text-xs">
            {blog.author} · {blog.batch} · {blog.branch}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>{blog.readTime}</span>
            <span className="text-yellow-600 dark:text-yellow-400 font-medium">
              Read →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
