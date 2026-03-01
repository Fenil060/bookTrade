import { useNavigate } from "react-router-dom";

const BookCard = ({ book }) => {
  const { _id, title, author, price, condition, images } = book;
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/books/${_id}`);
  };


  return (
    <div className="book-card">
      <img
        src={images?.[0] || "/no-book.png"}
        alt={title}
        className="book-image"
      />

      <h3 className="book-title">Book Name : {title}</h3>
      <p className="book-author">Book Author : {author}</p>

      <div className="book-footer">
        <span className="book-price">₹{price}</span>
        <button className="view-btn" onClick={handleViewDetail}>
          View Details
        </button>
        <span className="book-condition">{condition}</span>
      </div>
    </div>
  );
};

export default BookCard;

