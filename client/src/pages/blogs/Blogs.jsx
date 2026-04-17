import { useState, useEffect, useMemo } from "react";
import BlogCard from "../../components/blogs/BlogCard.jsx";
import { getBlogs } from "../../services/api.js";
import localBlogs from "../../data/blogs.js";

const LOCAL_TAGS = [...new Set(localBlogs.flatMap((b) => b.tags))];

function Blogs() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  // Initialise with local data immediately — no loading screen on first paint
  const [blogs, setBlogs] = useState(localBlogs);
  const [allTags, setAllTags] = useState(LOCAL_TAGS);
  const [debouncedSearch, setDebouncedSearch] = useState("");

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Placement Blogs
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Interview experiences, tips, and career advice from your fellow
            students
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
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
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              selectedTag === ""
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
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                selectedTag === tag
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
            <svg
              className="w-12 h-12 mx-auto mb-3 opacity-40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p>No blogs found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayBlogs.map((blog) => (
              <BlogCard key={blog._id || blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Blogs;
