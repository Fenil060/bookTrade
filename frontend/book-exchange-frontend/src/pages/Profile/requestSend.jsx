import { useEffect, useState } from "react";
import { getSentRequests, cancelRequest } from "../../api/request.api";
import "../../styles/requestSend.css";

const RequestsSent = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getSentRequests();
      setRequests(data.requests);   // IMPORTANT
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelRequest(id);

      // Update UI instantly (better than refetch)
      setRequests(prev =>
        prev.map(r =>
          r._id === id ? { ...r, status: "cancelled" } : r
        )
      );

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (requests.length === 0)
    return <p>No requests sent yet.</p>;

  return (
    <div className="requests-sent">

      <div className="request-header">
        <span>Book Title</span>
        <span>Seller Name</span>
        <span>Price</span>
        <span>Status</span>
        <span>Action</span>
      </div>

      {requests.map((req) => (
        <div key={req._id} className="request-row">

          <span>{req.bookId?.title}</span>

          <span>{req.sellerId?.name}</span>

          <span>₹{req.bookId?.price}</span>

          <span className={`status ${req.status}`}>
            {req.status}
          </span>

          <span>
            {req.status === "pending" ? (
              <button
                className="cancel-btn"
                onClick={() => handleCancel(req._id)}
              >
                Cancel
              </button>
            ) : (
              "-"
            )}
          </span>

        </div>
      ))}
    </div>
  );
};

export default RequestsSent;