import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Settings = () => {
  const [faqs, setFaqs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [title_en, setTitleEn] = useState("");
  const [title_ru, setTitleRu] = useState("");
  const [title_uz, setTitleUz] = useState("");
  const [text_en, setTextEn] = useState("");
  const [text_ru, setTextRu] = useState("");
  const [text_uz, setTextUz] = useState("");

  const token = localStorage.getItem("token");

  // GET
  const getFaqs = async () => {
    try {
      const response = await fetch("https://api.dezinfeksiyatashkent.uz/api/faqs");
      const data = await response.json();
      setFaqs(data.data || []);
    } catch (error) {
      console.error("Error", error);
    }
  };
  

  useEffect(() => {
    getFaqs();
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
      const response = await fetch("https://api.dezinfeksiyatashkent.uz/api/faqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("FAQ added successfully!");
        getFaqs();
        setModalOpen(false);
      } else {
        toast.error("Failed to add FAQ.");
      }
    } catch (error) {
      console.error("Error posting new FAQ:", error);
      toast.error("An error occurred while adding the FAQ.");
    }
  };

    // DELETE
const handleDeleteFaq = async (id) => {
  try {
    const response = await fetch(`https://api.dezinfeksiyatashkent.uz/api/faqs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      toast.success("FAQ deleted successfully!");
      getFaqs();
    } else {
      toast.error("Failed to delete FAQ.");
    }
  } catch (error) {
    console.error("Error deleting FAQ:", error);
  }
};

// EDIT
const handleEdit = (id) => {
  const faq = faqs.find((item) => item.id === id);
  if (faq) {
    setEditingFaqId(id);
    setTitleEn(faq.title_en);
    setTitleRu(faq.title_ru);
    setTitleUz(faq.title_uz);
    setTextEn(faq.text_en);
    setTextRu(faq.text_ru);
    setTextUz(faq.text_uz);
    setModalOpen(true);
  }
};

// UPDATE FAQ
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
    const response = await fetch(`https://api.dezinfeksiyatashkent.uz/api/faqs/${editingFaqId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success("FAQ updated successfully!");
      getFaqs();
      setModalOpen(false);
    } else {
      toast.error("Failed to update FAQ.");
    }
  } catch (error) {
    console.error("Error updating FAQ:", error);
  }
};


  const deleteToken = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-4">FAQs</h1>
      <button
        onClick={() => {
          setModalOpen(true);
          setEditingFaqId(null);
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
              {editingFaqId ? "Edit FAQ" : "Add FAQ"}
            </h2>
            <form onSubmit={editingFaqId ? handleUpdate : handlePost}>
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
                  {editingFaqId ? "Update" : "Add"}
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
          {faqs.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{item.title_en}</td>
              <td className="py-2 px-4 border-b">{item.title_ru}</td>
              <td className="py-2 px-4 border-b">{item.title_uz}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteFaq(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2"
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
};

export default Settings;
