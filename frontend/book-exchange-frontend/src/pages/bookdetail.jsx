import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookById } from "../api/book.api";
import { sendRequest } from "../api/request.api";
import { useNavigate } from "react-router-dom";
import "../styles/bookdetail.css";

const BookDetail = () => {
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequest = async () => {
  try {
    setRequestLoading(true);

    const data = await sendRequest(book._id);

    alert(data.message || "Request sent successfully");

    // redirect after success
    navigate("/");

  } catch (err) {
    alert(err.response?.data?.message || "Error sending request");
  } finally {
    setRequestLoading(false);
  }
};

  useEffect(() => {
    async function fetchBook() {
      try {
        const data = await getBookById(id);

        // show only available books
        if (data.status !== "available") {
          setBook(null);
        } else {
          setBook(data);
        }
      } catch (err) {
        console.error(err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not available</p>;

  return (
    <div className="detail-page">
    <div className="detail-container">
      <div className="detail-left">
        <div className="main-image">
          <img src={book.images[activeImg]} alt={book.title} />
        </div>

        <div className="thumb-row">
          {book.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              className={idx === activeImg ? "thumb active" : "thumb"}
              onClick={() => setActiveImg(idx)}
              alt=""
            />
          ))}
        </div>
      </div>

      <div className="detail-right">
        <p className="posted-by">
          Posted by: <span>{book.ownerId?.name}</span>
        </p>
        <div className="field title-field">
          {book.title}
        </div>

        <div className="field">
          <span className="label">Author</span>
          <span className="value">{book.author}</span>
        </div>

        <div className="field">
          <span className="label">Price</span>
          <span className="value">₹{book.price}</span>
        </div>

        <div className="field">
          <span className="label">Condition</span>
          <span className="value">{book.condition}</span>
        </div>

        {isLoggedIn && user &&
          book.ownerId?._id !== user._id && (
        <button
          className="request-btn"
          onClick={handleRequest}
          disabled={requestLoading}
        >
          {requestLoading ? "Sending..." : "Request Book"}
        </button>
        )}
      </div>
    </div>
    </div>
  );
};

export default BookDetail;
