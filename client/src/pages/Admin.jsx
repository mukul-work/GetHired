import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { uploadFile, createBlog } from "../services/api";

// ── Add Blog Modal ─────────────────────────────────────────
function AddBlogModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    batch: "",
    branch: "",
    company: "",
    excerpt: "",
    content: "",
    readTime: "5 min",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createBlog({
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      onSuccess();
      onClose();
    } catch {
      setError("Failed to create blog. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const field = (label, key, type = "text", placeholder = "") => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        required
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">Add New Blog</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("Title", "title", "text", "How I cracked Google...")}
            {field("Author", "author", "text", "Rahul Sharma")}
            {field("Batch", "batch", "text", "2024")}
            {field("Branch", "branch", "text", "CSE")}
            {field("Company", "company", "text", "Google")}
            {field("Read Time", "readTime", "text", "5 min")}
          </div>
          {field(
            "Tags (comma-separated)",
            "tags",
            "text",
            "Interview Experience, Google, DSA",
          )}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Excerpt
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Brief summary of the blog..."
              required
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Content
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Full blog content. Use **text** for bold, and new lines for paragraphs..."
              required
              rows={8}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 resize-none font-mono"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-yellow-400 text-gray-900 rounded-lg text-sm font-semibold hover:bg-yellow-500 disabled:opacity-60"
            >
              {loading ? "Publishing…" : "Publish Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── File Upload Dropzone ───────────────────────────────────
function UploadSection() {
  const [status, setStatus] = useState(null); // null | 'uploading' | 'success' | 'error'
  const [message, setMessage] = useState("");

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) return;
    const file = acceptedFiles[0];
    setStatus("uploading");
    setMessage("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const { data } = await uploadFile(fd);
      setStatus("success");
      setMessage(data.message || `Successfully uploaded ${data.count} records`);
    } catch (err) {
      setStatus("error");
      setMessage(
        err.response?.data?.message ||
          "Upload failed. Please check file format.",
      );
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-bold text-gray-800 mb-1">Upload Placement Data</h3>
      <p className="text-gray-500 text-sm mb-5">
        Upload a CSV or Excel file with placement records. Columns: studentName,
        branch, company, role, package, year, type
      </p>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-yellow-400 bg-yellow-50"
            : "border-gray-200 hover:border-yellow-300 hover:bg-yellow-50/30"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {status === "uploading" ? (
            <div className="animate-spin w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full" />
          ) : (
            <svg
              className={`w-12 h-12 ${isDragActive ? "text-yellow-400" : "text-gray-300"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          )}
          {status === "uploading" ? (
            <p className="text-yellow-600 font-medium">Uploading…</p>
          ) : isDragActive ? (
            <p className="text-yellow-600 font-medium">Drop the file here!</p>
          ) : (
            <>
              <p className="text-gray-600 font-medium">
                Drag & drop your file here
              </p>
              <p className="text-gray-400 text-sm">or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">
                Supported: .csv, .xlsx, .xls
              </p>
            </>
          )}
        </div>
      </div>

      {status === "success" && (
        <div className="mt-4 bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          {message}
        </div>
      )}
      {status === "error" && (
        <div className="mt-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          {message}
        </div>
      )}

      {/* CSV template hint */}
      <div className="mt-4 bg-gray-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-600 mb-2">
          Expected CSV/Excel Format:
        </p>
        <code className="text-xs text-gray-500 font-mono">
          studentName, branch, company, role, package, year, type
        </code>
        <br />
        <code className="text-xs text-gray-400 font-mono">
          Rahul Sharma, CSE, Google, Software Engineer, 42, 2024, On-Campus
        </code>
      </div>
    </div>
  );
}

// ── Main Admin Page ────────────────────────────────────────
export default function Admin() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [blogSuccess, setBlogSuccess] = useState(false);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            You must be logged in to access the admin panel.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-500"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Manage placement data and blog posts
            </p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setBlogSuccess(false);
              setShowBlogModal(true);
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-2xl p-5 text-left transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold text-lg">Add Blog Post</p>
                <p className="text-gray-600 text-sm">
                  Publish new placement experience
                </p>
              </div>
            </div>
          </button>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-800">View Dashboard</p>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-yellow-600 text-sm hover:underline"
              >
                Go to full analytics →
              </button>
            </div>
          </div>
        </div>

        {blogSuccess && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 border border-green-100">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Blog published successfully!
          </div>
        )}

        {/* Upload Section */}
        <UploadSection />
      </div>

      {/* Blog Modal */}
      {showBlogModal && (
        <AddBlogModal
          onClose={() => setShowBlogModal(false)}
          onSuccess={() => setBlogSuccess(true)}
        />
      )}
    </div>
  );
}
