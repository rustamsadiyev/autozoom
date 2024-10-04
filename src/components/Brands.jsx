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
    if (!title_en || !title_ru || !title_uz || !text_en || !text_ru || !text_uz) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      title_en,
      title_ru,
      title_uz,
      text_en,
      text_ru,
      text_uz
    };

    try {
      const response = await fetch("https://api.dezinfeksiyatashkent.uz/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
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
      setModalOpen(true);
    }
  };

  // UPDATE News
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title_en || !title_ru || !title_uz) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      title_en,
      title_ru,
      title_uz,
    };

    try {
      const response = await fetch(`https://api.dezinfeksiyatashkent.uz/api/news/${editingNewsId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
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
        }}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
      >
        POST
      </button>
      <button className="w-[100px] h-[40px] rounded-md ml-[60rem] bg-yellow-300" onClick={deleteToken}>Logout</button>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {editingNewsId ? "Edit News" : "Add News"}
            </h2>
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
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {editingNewsId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="text-center min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="py-2 px-4 border-b">Title (EN)</th>
            <th className="py-2 px-4 border-b">Title (RU)</th>
            <th className="py-2 px-4 border-b">Title (UZ)</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {news.map((item) => (
            <tr key={item.id} className="text-gray-700">
              <td className="py-2 px-4 border-b">{item.title_en}</td>
              <td className="py-2 px-4 border-b">{item.title_ru}</td>
              <td className="py-2 px-4 border-b">{item.title_uz}</td>
              <td className="py-2 px-4 border-b space-x-2">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteNews(item.id)}
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

export default Brands;
