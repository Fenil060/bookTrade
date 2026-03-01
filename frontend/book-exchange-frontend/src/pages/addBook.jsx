import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBook } from "../api/book.api";
import "../styles/addBook.css";

const AddBook = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    condition: "",
    images: []
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setFormData({
      ...formData,
      images: files
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("author", formData.author);
      data.append("price", formData.price);
      data.append("condition", formData.condition);

      formData.images.forEach((image) => {
        data.append("images", image);
      });

      await addBook(data);

      alert("Book added successfully ");
      navigate("/profile/my-books");

    } catch (error) {
      alert(error.response?.data?.message || "Error adding book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-book-wrapper">
      <div className="add-book-card">
        <h2>Add Book</h2>

        <form onSubmit={handleSubmit} className="add-book-form">

          <input
            type="text"
            name="title"
            placeholder="Book Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
          >
            <option value="">Select Condition</option>
            <option value="new">New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Book"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddBook;