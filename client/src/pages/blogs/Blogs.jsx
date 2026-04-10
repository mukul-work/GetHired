import { useState } from 'react';
import blogs from '../../data/blogs.js';
import BlogCard from '../../components/blogs/BlogCard.jsx';

const allTags = [...new Set(blogs.flatMap(blog => blog.tags))];

function Blogs() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const filtered = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag === '' || blog.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Blogs</h1>
      <input
        type="text"
        placeholder="Search blogs..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setSelectedTag('')}
          className={`px-3 py-1 rounded-full text-sm border ${selectedTag === '' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-full text-sm border ${selectedTag === tag ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4">
        {filtered.map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}

export default Blogs;