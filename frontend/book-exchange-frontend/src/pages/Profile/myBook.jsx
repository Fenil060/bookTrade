import { useOutletContext } from "react-router-dom";
import { deleteBook } from "../../api/book.api.js";
import "../../styles/myBook.css";

export default function MyBooks() {
  const { myBooks, setMyBooks } = useOutletContext();

  const books = myBooks || [];

  if (!books.length) {
    return <h2>You haven't added any books yet </h2>;
  }

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this book?"
  );
  if (!confirmDelete) return;

  try {
    await deleteBook(id);

    setMyBooks((prev) =>
      prev.filter((book) => book._id !== id)
    );

  } catch (error) {
    alert(error.response?.data?.message || "Delete failed");
  }
};

  return (
    <div className="books-grid">
      {books.map((book) => (
        <div key={book._id} className="book-card">
          <img
            src={ book.images && book.images.length > 0 ? book.images[0]: "/placeholder.png"}
            alt={book.title}
            className="book-image"
          />

          <div className="book-info">
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Price: ₹{book.price}</p>
            <p>Condition: {book.condition}</p>
            <p>Status: {book.status}</p>
          </div>

          <div className="book-actions">
            <button
              className="edit-btn"
              onClick={() => console.log("Edit", book._id)}
            >
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => handleDelete(book._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
