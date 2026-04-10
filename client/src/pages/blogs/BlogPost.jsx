import { useParams } from 'react-router-dom';
import blogs from '../../data/blogs.js';

function BlogPost() {
  const { id } = useParams();
  const blog = blogs.find(b => b.id === Number(id));

  if (!blog) return <div>Blog not found</div>;

  return (
    <div>
      <h1>{blog.title}</h1>
      <p>{blog.author} · {blog.batch} · {blog.branch} · {blog.company}</p>
      <p>{blog.date} · {blog.readTime}</p>
      <div>
        {blog.tags.map(tag => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <p>{blog.excerpt}</p>
    </div>
  );
}

export default BlogPost;