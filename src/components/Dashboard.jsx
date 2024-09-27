import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [nameEn, setNameEn] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [image, setImage] = useState(null);

  const token = localStorage.getItem("token");

  // GET 
  const getCategories = async () => {
    try {
      const response = await fetch("https://autoapi.dezinfeksiyatashkent.uz/api/categories");
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // POST
  const handlePost = async (e) => {
    e.preventDefault();
    if (!nameEn || !nameRu) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name_en", nameEn);
    formData.append("name_ru", nameRu);
    formData.append("images", image);

    try {
      const response = await fetch("https://autoapi.dezinfeksiyatashkent.uz/api/categories", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (response.ok) {
        toast.success("Category added successfully!");
        getCategories();
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Error posting new category:", error);
    }
  };

  // DELETE
  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        toast.success("Category deleted successfully!");
        getCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // EDIT
  const handleEdit = (id) => {
    const category = categories.find((item) => item.id === id);
    if (category) {
      setEditingCategoryId(id);
      setNameEn(category.name_en);
      setNameRu(category.name_ru);
      setImage(null);
      setModalOpen(true);
    }
  };

  // UPDATE Category
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!nameEn || !nameRu) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name_en", nameEn);
    formData.append("name_ru", nameRu);
    if (image) {
      formData.append("images", image);
    }

    try {
      const response = await fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories/${editingCategoryId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (response.ok) {
        toast.success("Category updated successfully!");
        getCategories();
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <button
        onClick={() => {
          setModalOpen(true);
          setEditingCategoryId(null);
          setNameEn("");
          setNameRu("");
          setImage(null);
        }}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
      >
        POST
      </button>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {editingCategoryId ? "Edit Category" : "Add Category"}
            </h2>
            <form onSubmit={editingCategoryId ? handleUpdate : handlePost}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name (EN)</label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name (RU)</label>
                <input
                  type="text"
                  value={nameRu}
                  onChange={(e) => setNameRu(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="border border-gray-300 p-2 w-full rounded"
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
                  {editingCategoryId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="text-center min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="py-2 px-4 border-b">Name (EN)</th>
            <th className="py-2 px-4 border-b">Name (RU)</th>
            <th className="py-2 px-4 border-b">Image</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{item.name_en}</td>
              <td className="py-2 px-4 border-b">{item.name_ru}</td>
              <td className="py-2 pl-0 h-[100px] ml-10 border-b">
                <img
                  src={`https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${item.image_src}`}
                  alt={item.name_en}
                  className="w-24 h-18 object-cover"
                />
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(item.id)}
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

export default Dashboard;
