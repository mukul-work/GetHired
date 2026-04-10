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
    <div>
        <div className="text-red-500">Test</div>
      <input
        type="text"
        placeholder="Search blogs..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div>
        <button onClick={() => setSelectedTag('')}>All</button>
        {allTags.map(tag => (
          <button key={tag} onClick={() => setSelectedTag(tag)}>{tag}</button>
        ))}
      </div>
      {filtered.map(blog => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}

export default Blogs;