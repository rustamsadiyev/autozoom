import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Cities() {
  const [sources, setSources] = useState([]); // State to hold sources
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState(null);
  const [title, setTitle] = useState(""); // Combined title
  const [category, setCategory] = useState(""); // Category
  const [images, setImages] = useState(null); // Replacing image with images
  const [categories, setCategories] = useState([]); // New state for categories

  const getCategories = async () => {
    try {
        const response = await fetch("https://api.dezinfeksiyatashkent.uz/api/categories"); // Adjust the URL accordingly
        const data = await response.json();
        setCategories(data.data || []); // Set categories data
    } catch (error) {
        console.error("Error fetching categories", error);
    }
};

useEffect(() => {
    getSources(); // Fetch sources on mount
    getCategories(); // Fetch categories on mount
}, []);

  const token = localStorage.getItem("token");

  // GET
  const getSources = async () => {
    try {
      const response = await fetch("https://api.dezinfeksiyatashkent.uz/api/sources"); // Changed URL to sources
      const data = await response.json();
      setSources(data.data || []); // Set sources data
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    getSources(); // Fetch sources on mount
  }, []);

  // POST
  const handlePost = async (e) => {
    e.preventDefault();
    if (!title || !category || !images) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", parseInt(category)); // Convert category to integer
    formData.append("images", images);

    try {
      const response = await fetch("https://api.dezinfeksiyatashkent.uz/api/sources", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Source added successfully!"); // Updated success message
        getSources(); // Refresh the sources list
        setModalOpen(false);
      } else {
        toast.error("Failed to add source."); // Updated error message
      }
    } catch (error) {
      console.error("Error posting new source:", error);
      toast.error("An error occurred while adding the source."); // Updated error message
    }
  };

  // DELETE
  const handleDeleteSource = async (id) => {
    try {
      const response = await fetch(`https://api.dezinfeksiyatashkent.uz/api/sources/${id}`, { // Changed URL to sources
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Source deleted successfully!"); // Updated success message
        getSources(); // Refresh the sources list
      } else {
        toast.error("Failed to delete source."); // Updated error message
      }
    } catch (error) {
      console.error("Error deleting source:", error);
    }
  };

  // EDIT
  const handleEdit = (id) => {
    const sourceItem = sources.find((item) => item.id === id);
    if (sourceItem) {
      setEditingSourceId(id);
      setTitle(sourceItem.title);
      setCategory(sourceItem.category); 
      setImages(null); 
      setModalOpen(true);
    }
  };

  // UPDATE Source
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title || !category) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", parseInt(category));
    if (images) {
      formData.append("images", images);
    }

    try {
      const response = await fetch(`https://api.dezinfeksiyatashkent.uz/api/sources/${editingSourceId}`, { // Changed URL to sources
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Source updated successfully!");
        getSources(); 
        setModalOpen(false);
      } else {
        toast.error("Failed to update source.");
      }
    } catch (error) {
      console.error("Error updating source:", error);
    }
  };

  const deleteToken = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-4">Sources</h1>
      <button
        onClick={() => {
          setModalOpen(true);
          setEditingSourceId(null);
          setTitle("");
          setCategory("");
          setImages(null);
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
            <h2 className="text-lg font-semibold mb-4">{editingSourceId ? "Edit Source" : "Add Source"}</h2>
            <form onSubmit={editingSourceId ? handleUpdate : handlePost}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded"
                  required
                />
              </div><div className="mb-4">

    <label className="block text-sm font-medium mb-1">Category</label>
    <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-300 p-2 w-full rounded"
        required
    >
        <option value="">Select a category</option>
        {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
                {cat.name}
            </option>
        ))}
    </select>
</div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Images</label>
                <input
                  type="file"
                  onChange={(e) => setImages(e.target.files[0])} // Handling images input
                  className="border border-gray-300 p-2 w-full rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {editingSourceId ? "Update" : "Add"} {/* Dynamic button text */}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="min-w-full mt-4 border border-gray-300 text-center ">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">No</th>
            <th className="border border-gray-300 px-4 py-2">Images</th>
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sources.map((source, index) => (
            <tr key={source.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{source.images && <img src={`https://api.dezinfeksiyatashkent.uz/api/sources/${source.images}`} alt={source.title} className="w-16 h-16 object-cover" />}</td>
              <td className="border border-gray-300 px-4 py-2">{source.title}</td>
              <td className="border border-gray-300 px-4 py-2">{source.category}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button onClick={() => handleEdit(source.id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                <button onClick={() => handleDeleteSource(source.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Cities;
