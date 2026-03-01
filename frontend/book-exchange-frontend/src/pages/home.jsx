import { useEffect, useState, useContext } from "react";
import { getAvailableBooks } from "../api/book.api";
import BookCard from "../component/bookcard";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const [books, setBooks] = useState([]);
  const { user } = useContext(AuthContext); //reactive
  const userId = user?._id;

  useEffect(() => {
    async function fetchBooks() {
      const data = await getAvailableBooks();

      // hide own books ONLY if logged in
      const filteredBooks = userId
        ? data.filter((book) => book.ownerId !== userId)
        : data;

      setBooks(filteredBooks);
    }

    fetchBooks();
  }, [userId]); //  re-runs on login/logout

  return (
    <div className="home-container">
      <h1 className="home-title">Available Books</h1>

      <div className="book-grid">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Home;

