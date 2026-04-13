import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBlogs } from "../../services/api";
import localBlogs from "../../data/blogs.js";

function BlogsPreview() {
  const navigate = useNavigate();
  // Start with local data so the section is instantly visible
  const [blogs, setBlogs] = useState(() => localBlogs.slice(0, 3));

  useEffect(() => {
    getBlogs({ limit: 3 })
      .then(({ data }) => {
        if (data.data?.length > 0) setBlogs(data.data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="px-6 sm:px-10 py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Latest Blogs</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Interview experiences from your fellow students
            </p>
          </div>
          <button
            onClick={() => navigate("/blogs")}
            className="text-yellow-600 text-sm font-medium hover:underline"
          >
            View all →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {blogs.map((blog) => {
            const id = blog._id || blog.id;
            return (
              <div
                key={id}
                onClick={() => navigate(`/blogs/${id}`)}
                className="cursor-pointer bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition"
              >
                <div className="flex gap-2 mb-3 flex-wrap">
                  {(blog.tags || []).slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-2 leading-snug line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>
                <p className="text-gray-400 text-xs">
                  {blog.author} · {blog.readTime}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BlogsPreview;
