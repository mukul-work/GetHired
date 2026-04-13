import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBlog } from "../../services/api.js";
import localBlogs from "../../data/blogs.js";

function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBlog(id)
      .then(({ data }) => setBlog(data))
      .catch(() => {
        // fallback to local data
        const local = localBlogs.find(
          (b) => String(b.id) === id || b._id === id,
        );
        setBlog(local || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-16 mb-6" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-1/2 mb-8" />
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="h-4 bg-gray-100 rounded mb-3" />
          ))}
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-400 text-lg mb-4">Blog not found</p>
        <button
          onClick={() => navigate("/blogs")}
          className="text-yellow-600 hover:underline text-sm"
        >
          ← Back to Blogs
        </button>
      </div>
    );
  }

  const formattedDate = blog.date
    ? new Date(blog.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <button
          onClick={() => navigate("/blogs")}
          className="flex items-center gap-1 text-yellow-600 text-sm mb-8 hover:underline"
        >
          ← Back to Blogs
        </button>

        {/* Tags */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {(blog.tags || []).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
          {blog.title}
        </h1>

        {/* Author Meta */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold text-sm">
            {blog.author?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{blog.author}</p>
            <p className="text-xs text-gray-400">
              {blog.branch} · Batch {blog.batch} · Placed at {blog.company}
              {formattedDate && ` · ${formattedDate}`}
              {blog.readTime && ` · ${blog.readTime} read`}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
          {(blog.content || blog.excerpt || "").split("\n").map((para, i) => {
            if (!para.trim()) return <br key={i} />;
            if (para.startsWith("**") && para.endsWith("**")) {
              return (
                <h3
                  key={i}
                  className="text-lg font-bold text-gray-800 mt-6 mb-2"
                >
                  {para.replace(/\*\*/g, "")}
                </h3>
              );
            }
            if (para.startsWith("- ") || para.startsWith("• ")) {
              return (
                <li key={i} className="ml-4 mb-1 text-gray-700">
                  {para.replace(/^[•\-] /, "").replace(/\*\*(.*?)\*\*/g, "$1")}
                </li>
              );
            }
            if (/^\d+\.\s/.test(para)) {
              return (
                <p key={i} className="ml-4 mb-1 text-gray-700">
                  {para.replace(/\*\*(.*?)\*\*/g, "$1")}
                </p>
              );
            }
            return (
              <p key={i} className="mb-3 text-gray-700">
                {para
                  .split(/(\*\*.*?\*\*)/)
                  .map((part, j) =>
                    part.startsWith("**") && part.endsWith("**") ? (
                      <strong key={j}>{part.replace(/\*\*/g, "")}</strong>
                    ) : (
                      part
                    ),
                  )}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BlogPost;
