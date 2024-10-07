import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Models() {
  const [blogs, setBlogs] = useState([]); // Changed state from news to blogs
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [title_en, setTitleEn] = useState("");
  const [title_ru, setTitleRu] = useState("");
  const [title_uz, setTitleUz] = useState("");
  const [text_en, setTextEn] = useState("");
  const [text_ru, setTextRu] = useState("");
  const [text_uz, setTextUz] = useState("");
  const [author, setAuthor] = useState(""); // Added author state
  const [images, setImages] = useState(null); // Replacing image with images

  const token = localStorage.getItem("token");

  // GET
  const getBlogs = async () => {
    try {
      const response = await fetch("https://api.dezinfeksiyatashkent.uz/api/blogs"); // Changed URL to blogs
      const data = await response.json();
      setBlogs(data.data || []); // Set blogs data
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    getBlogs(); // Fetch blogs on mount
  }, []);

  // POST
  const handlePost = async (e) => {
    e.preventDefault();
    if (!title_en || !title_ru || !title_uz || !text_en || !text_ru || !text_uz || !author || !images) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title_en", title_en);
    formData.append("title_ru", title_ru);
    formData.append("title_uz", title_uz);
    formData.append("text_en", text_en);
    formData.append("text_ru", text_ru);
    formData.append("text_uz", text_uz);
    formData.append("author", author);
    formData.append("images", images);

    try {
      const response = await fetch("https://api.dezinfeksiyatashkent.uz/api/blogs", { // Changed URL to blogs
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Blog added successfully!"); // Updated success message
        getBlogs(); // Refresh the blogs list
        setModalOpen(false);
      } else {
        toast.error("Failed to add blog."); // Updated error message
      }
    } catch (error) {
      console.error("Error posting new blog:", error);
      toast.error("An error occurred while adding the blog."); // Updated error message
    }
  };

  // DELETE
  const handleDeleteBlog = async (id) => { // Changed function name to handleDeleteBlog
    try {
      const response = await fetch(`https://api.dezinfeksiyatashkent.uz/api/blogs/${id}`, { // Changed URL to blogs
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Blog deleted successfully!"); // Updated success message
        getBlogs(); // Refresh the blogs list
      } else {
        toast.error("Failed to delete blog."); // Updated error message
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  // EDIT
  const handleEdit = (id) => {
    const blogItem = blogs.find((item) => item.id === id); // Changed to blogItem
    if (blogItem) {
      setEditingBlogId(id); // Updated to editingBlogId
      setTitleEn(blogItem.title_en);
      setTitleRu(blogItem.title_ru);
      setTitleUz(blogItem.title_uz);
      setTextEn(blogItem.text_en);
      setTextRu(blogItem.text_ru);
      setTextUz(blogItem.text_uz);
      setAuthor(blogItem.author); 
      setModalOpen(true);
    }
  };

  // UPDATE Blog
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title_en || !title_ru || !title_uz || !text_en || !text_ru || !text_uz || !author) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title_en", title_en);
    formData.append("title_ru", title_ru);
    formData.append("title_uz", title_uz);
    formData.append("text_en", text_en);
    formData.append("text_ru", text_ru);
    formData.append("text_uz", text_uz);
    formData.append("author", author); // Append author
    if (images) {
      formData.append("images", images); // Optionally add images if updated
    }

    try {
      const response = await fetch(`https://api.dezinfeksiyatashkent.uz/api/blogs/${editingBlogId}`, { // Changed URL to blogs
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Blog updated successfully!"); // Updated success message
        getBlogs(); // Refresh the blogs list
        setModalOpen(false);
      } else {
        toast.error("Failed to update blog."); // Updated error message
      }
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  const deleteToken = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-4">Blogs</h1> {/* Changed title */}
      <button
        onClick={() => {
          setModalOpen(true);
          setEditingBlogId(null); // Updated to null
          setTitleEn("");
          setTitleRu("");
          setTitleUz("");
          setTextEn("");
          setTextRu("");
          setTextUz("");
          setAuthor(""); // Clear author field
          setImages(null); // Clear images field
        }}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
      >
        POST
      </button>
      <button className="w-[100px] h-[40px] rounded-md ml-[60rem] bg-yellow-300" onClick={deleteToken}>
        Logout
      </button>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">{editingBlogId ? "Edit Blog" : "Add Blog"}</h2> {/* Updated modal title */}
            <form onSubmit={editingBlogId ? handleUpdate : handlePost}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title (EN)</label>
                <input
                  type="text"
                  value={title_en}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title (RU)</label>
                <input
                  type="text"
                  value={title_ru}
                  onChange={(e) => setTitleRu(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title (UZ)</label>
                <input
                  type="text"
                  value={title_uz}
                  onChange={(e) => setTitleUz(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Text (EN)</label>
                <input
                  type="text"
                  value={text_en}
                  onChange={(e) => setTextEn(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Text (RU)</label>
                <input
                  type="text"
                  value={text_ru}
                  onChange={(e) => setTextRu(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Text (UZ)</label>
                <input
                  type="text"
                  value={text_uz}
                  onChange={(e) => setTextUz(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Images</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImages(e.target.files[0])} // Updated to handle multiple images if needed
                  className="border border-gray-300 p-2 w-full rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {editingBlogId ? "Update Blog" : "Add Blog"} {/* Updated button text */}
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white text-center ">
        <thead>
          <tr>
            <th className="border px-4 py-2">No</th>
            <th className="border px-4 py-2">Images</th>
            <th className="border px-4 py-2">Title (UZ)</th>
            <th className="border px-4 py-2">Text (UZ)</th>
            <th className="border px-4 py-2">Author</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((item,index) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{index+1}</td>
              <td className="border px-4 py-2">
                {/* <img src={`https://api.dezinfeksiyatashkent.uz/api/blogs/${item.news_images[0]['image.src']}`} alt="Rasm bor!" /> */}

              </td>
              <td className="border px-4 py-2">{item.title_uz}</td>
              <td className="border px-4 py-2">{item.text_uz}</td>
              <td className="border px-4 py-2">{item.author}</td> {/* Updated to display author */}
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(item.id)} // Updated to handleEdit
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBlog(item.id)} // Updated to handleDeleteBlog
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Models;
