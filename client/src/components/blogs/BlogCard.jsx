import { useNavigate } from "react-router-dom";

export default function BlogCard({blog}){
    const navigate = useNavigate();
    return(
        <div onClick={() => navigate(`/blogs/${blog.id}`)} style={{ cursor: "pointer" }}>
            <h2>{blog.title}</h2>
            <p>{blog.author} · {blog.batch} · {blog.branch}</p>
            <p>{blog.excerpt}</p>
            <p>{blog.date} · {blog.readTime}</p>
            <div>
                {blog.tags.map(tag => (
                    <span key={tag}>{tag}</span>
                ))}
            </div>
        </div>
    )
}