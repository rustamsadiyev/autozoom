import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Brands() {

  
  const [news, setNews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState(null);
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
  const getNews = async () => {
    try {
      const response = await fetch("https://api.dezinfeksiyatashkent.uz/api/news");
      const data = await response.json();
      setNews(data.data || []);
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    getNews();
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
      const response = await fetch("https://api.dezinfeksiyatashkent.uz/api/news", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("News added successfully!");
        getNews();
        setModalOpen(false);
      } else {
        toast.error("Failed to add news.");
      }
    } catch (error) {
      console.error("Error posting new news:", error);
      toast.error("An error occurred while adding the news.");
    }
  };

  // DELETE
  const handleDeleteNews = async (id) => {
    try {
      const response = await fetch(`https://api.dezinfeksiyatashkent.uz/api/news/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("News deleted successfully!");
        getNews();
      } else {
        toast.error("Failed to delete news.");
      }
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  // EDIT
  const handleEdit = (id) => {
    const newsItem = news.find((item) => item.id === id);
    if (newsItem) {
      setEditingNewsId(id);
      setTitleEn(newsItem.title_en);
      setTitleRu(newsItem.title_ru);
      setTitleUz(newsItem.title_uz);
      setTextEn(newsItem.text_en);
      setTextRu(newsItem.text_ru);
      setTextUz(newsItem.text_uz);
      setAuthor(newsItem.author); 
      setModalOpen(true);
    }
  };

  // UPDATE News
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
      const response = await fetch(`https://api.dezinfeksiyatashkent.uz/api/news/${editingNewsId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("News updated successfully!");
        getNews();
        setModalOpen(false);
      } else {
        toast.error("Failed to update news.");
      }
    } catch (error) {
      console.error("Error updating news:", error);
    }
  };

  const deleteToken = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-4">News</h1>
      <button
        onClick={() => {
          setModalOpen(true);
          setEditingNewsId(null);
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
            <h2 className="text-lg font-semibold mb-4">{editingNewsId ? "Edit News" : "Add News"}</h2>
            <form onSubmit={editingNewsId ? handleUpdate : handlePost}>
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
                  onChange={(e) => setImages(e.target.files[0])}
                  className="border border-gray-300 p-2 w-full rounded"
                  required
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                {editingNewsId ? "Update News" : "Add News"}
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <table className=" text-center min-w-full border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">No</th>
            <th className="border border-gray-300 px-4 py-2">Images</th>
            <th className="border border-gray-300 px-4 py-2">Name (UZ)</th>
            <th className="border border-gray-300 px-4 py-2">Text (UZ)</th>
            <th className="border border-gray-300 px-4 py-2">Author</th> 
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {news.map((item, index) => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-4 py-2">{index+1}</td>
              <td className="border border-gray-300 px-4 py-2">
                {/* <img src={`https://api.dezinfeksiyatashkent.uz/api/news/${item.news_images}`} alt="Rasm bor!" /> */}
                </td>
              <td className="border border-gray-300 px-4 py-2">{item.title_uz}</td>
              <td className="border border-gray-300 px-4 py-2">{item.text_uz}</td>
              <td className="border border-gray-300 px-4 py-2">{item.author}</td> {/* Displaying Author */}
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteNews(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
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

export default Brands;
