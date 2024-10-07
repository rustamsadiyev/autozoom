  import React, { useEffect, useState } from "react";
  import { toast, ToastContainer } from "react-toastify";
  import 'react-toastify/dist/ReactToastify.css';

  const Dashboard = () => {
    const [categories, setCategories] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const token = localStorage.getItem("token");

    // GET
    const getCategories = async () => {
      try {
        const response = await fetch("https://api.dezinfeksiyatashkent.uz/api/categories");
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
      if (!name || !description) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);

      try {
        const response = await fetch("https://api.dezinfeksiyatashkent.uz/api/categories", {
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
        const response = await fetch(`https://api.dezinfeksiyatashkent.uz/api/categories/${id}`, {
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
        setName(category.name);
        setDescription(category.description);
        setModalOpen(true);
      }
    };

    // UPDATE Category
    const handleUpdate = async (e) => {
      e.preventDefault();
      if (!name || !description) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);

      try {
        const response = await fetch(`https://api.dezinfeksiyatashkent.uz/api/categories/${editingCategoryId}`, {
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

    const deleteToken = () => {
      localStorage.removeItem("token");
      window.location.href="/login"
    }

    return (
      <div className="p-4">
        <ToastContainer />
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <button
          onClick={() => {
            setModalOpen(true);
            setEditingCategoryId(null);
            setName("");
            setDescription("");
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
        >
          POST
        </button>
        <button className="w-[100px] h-[40px] rounded-md ml-[60rem] bg-yellow-300 " onClick={deleteToken}>Logout</button>

        {modalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                {editingCategoryId ? "Edit Category" : "Add Category"}
              </h2>
              <form onSubmit={editingCategoryId ? handleUpdate : handlePost}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 p-2 w-full rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
              <th className="py-2 px-4 border-b">No</th>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{item.id}</td>
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b">{item.description}</td>
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
