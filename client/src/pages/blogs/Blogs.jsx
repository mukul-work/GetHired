import { useState, useEffect, useMemo } from "react";
import BlogCard from "../../components/blogs/BlogCard.jsx";
import { getBlogs, updateBlog, deleteBlog } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import localBlogs from "../../data/blogs.js";

const LOCAL_TAGS = [...new Set(localBlogs.flatMap((b) => b.tags))];

// ── Edit Blog Modal ──────────────────────────────────────────
function EditBlogModal({ blog, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: blog.title || "",
    author: blog.author || "",
    batch: blog.batch || "",
    branch: blog.branch || "",
    company: blog.company || "",
    excerpt: blog.excerpt || "",
    content: blog.content || "",
    readTime: blog.readTime || "5 min",
    tags: (blog.tags || []).join(", "),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const id = blog._id || blog.id;
      await updateBlog(id, {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      onSaved();
      onClose();
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const field = (label, key, type = "text", placeholder = "") => (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        required
        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Edit Blog</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("Title", "title", "text", "How I cracked Google...")}
            {field("Author", "author", "text", "Rahul Sharma")}
            {field("Batch", "batch", "text", "2024")}
            {field("Branch", "branch", "text", "CSE")}
            {field("Company", "company", "text", "Google")}
            {field("Read Time", "readTime", "text", "5 min")}
          </div>
          {field("Tags (comma-separated)", "tags", "text", "Interview Experience, Google, DSA")}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Brief summary..."
              required
              rows={2}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Full blog content..."
              required
              rows={8}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 resize-none font-mono"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-yellow-400 text-gray-900 rounded-lg text-sm font-semibold hover:bg-yellow-500 disabled:opacity-60"
            >
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirmation Dialog ───────────────────────────────
function DeleteConfirmModal({ blog, onClose, onConfirmed }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const id = blog._id || blog.id;
      await deleteBlog(id);
      onConfirmed(id);
      onClose();
    } catch {
      // silently ignore error, could show toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-center font-bold text-gray-800 dark:text-white text-lg mb-1">
          Delete Blog?
        </h3>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            &quot;{blog.title}&quot;
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Blogs Page ──────────────────────────────────────────
function Blogs() {
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  // Initialise with local data immediately — no loading screen on first paint
  const [blogs, setBlogs] = useState(localBlogs);
  const [allTags, setAllTags] = useState(LOCAL_TAGS);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Edit/Delete modal state
  const [editBlog, setEditBlog] = useState(null);
  const [deletingBlog, setDeletingBlog] = useState(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Background-fetch from API and silently update if available
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedTag) params.tag = selectedTag;
    getBlogs(params)
      .then(({ data }) => {
        if (data.data && data.data.length > 0) {
          setBlogs(data.data);
          if (data.allTags && data.allTags.length > 0) setAllTags(data.allTags);
        }
      })
      .catch(() => {
        // API unavailable — filter local data client-side
        const filtered = localBlogs.filter((b) => {
          const ms =
            !debouncedSearch ||
            b.title.toLowerCase().includes(debouncedSearch.toLowerCase());
          const mt = !selectedTag || b.tags.includes(selectedTag);
          return ms && mt;
        });
        setBlogs(filtered);
        setAllTags(LOCAL_TAGS);
      });
  }, [debouncedSearch, selectedTag]);

  // Client-side filter for instant search feel
  const displayBlogs = useMemo(() => {
    if (!debouncedSearch && !selectedTag) return blogs;
    return blogs.filter((b) => {
      const ms =
        !debouncedSearch ||
        b.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      const mt = !selectedTag || (b.tags || []).includes(selectedTag);
      return ms && mt;
    });
  }, [blogs, debouncedSearch, selectedTag]);

  // After edit, re-fetch fresh data
  const handleSaved = () => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedTag) params.tag = selectedTag;
    getBlogs(params)
      .then(({ data }) => {
        if (data.data) setBlogs(data.data);
        if (data.allTags?.length) setAllTags(data.allTags);
      })
      .catch(() => { });
  };

  // After delete, remove from local state instantly
  const handleDeleted = (id) => {
    setBlogs((prev) => prev.filter((b) => (b._id || b.id) !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Placement Blogs
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Interview experiences, tips, and career advice from your fellow students
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Search Bar */}
        <div className="relative mb-5">
          <svg
            className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by title, company, author…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
          />
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setSelectedTag("")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${selectedTag === ""
                ? "bg-yellow-400 text-gray-900 border-yellow-400"
                : "text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-700 bg-white dark:bg-gray-800"
              }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? "" : tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${selectedTag === tag
                  ? "bg-yellow-400 text-gray-900 border-yellow-400"
                  : "text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-700 bg-white dark:bg-gray-800"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {displayBlogs.length}{" "}
          {displayBlogs.length === 1 ? "article" : "articles"} found
          {debouncedSearch && ` for "${debouncedSearch}"`}
        </p>

        {/* Blog list */}
        {displayBlogs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No blogs found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayBlogs.map((blog) => (
              <BlogCard
                key={blog._id || blog.id}
                blog={blog}
                isAdmin={isAdmin}
                onEdit={setEditBlog}
                onDelete={setDeletingBlog}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editBlog && (
        <EditBlogModal
          blog={editBlog}
          onClose={() => setEditBlog(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingBlog && (
        <DeleteConfirmModal
          blog={deletingBlog}
          onClose={() => setDeletingBlog(null)}
          onConfirmed={handleDeleted}
        />
      )}
    </div>
  );
}

export default Blogs;

