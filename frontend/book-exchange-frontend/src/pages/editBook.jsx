import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookById, editBook } from "../api/book.api";
import "../styles/addBook.css";

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // FETCH BOOK HERE
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getBookById(id);

        if (!data) {
          navigate("/profile/my-books");
          return;
        }

        if (data.status !== "available") {
          alert("Book cannot be edited.");
          navigate("/profile/my-books");
          return;
        }

        setBook(data);
        setLoading(false);
      } catch (error) {
        navigate("/profile/my-books");
      }
    };

    fetchBook();
  }, [id, navigate]);

  // PREVENT CRASH HERE
  if (loading || !book) return <p>Loading...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await editBook(id, book);
      alert("Book updated successfully");
      navigate("/profile/my-books");
    } catch (error) {
      alert("Update failed");
    }
  };

  
  return (
  <div className="add-book-wrapper">
    <div className="add-book-card">
      <h2>Edit Book</h2>

      <form onSubmit={handleSubmit} className="add-book-form">

        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={book.title}
          onChange={(e) =>
            setBook({ ...book, title: e.target.value })
          }
          required
        />

        <input
          type="text"
          name="author"
          placeholder="Author"
          value={book.author}
          onChange={(e) =>
            setBook({ ...book, author: e.target.value })
          }
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={book.price}
          onChange={(e) =>
            setBook({ ...book, price: e.target.value })
          }
          required
        />

        <select
          name="condition"
          value={book.condition}
          onChange={(e) =>
            setBook({ ...book, condition: e.target.value })
          }
          required
        >
          <option value="">Select Condition</option>
          <option value="new">New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>

        <button type="submit">
          Update Book
        </button>

      </form>
    </div>
  </div>
);
}