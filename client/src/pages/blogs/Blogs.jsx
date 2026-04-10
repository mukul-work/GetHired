import blogs from "../../data/blogs";
import BlogCard from "../../components/blogs/BlogCard";

export default function Blogs() {
    return (
        <div>
            <h1>Blogs Page</h1>
            <div>
                {blogs.map(blog => (
                    <BlogCard key={blog.id} blog={blog}/>
                ))}
            </div>
        </div>
    )
}