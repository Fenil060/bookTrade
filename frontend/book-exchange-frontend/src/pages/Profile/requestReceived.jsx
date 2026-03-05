import { useEffect, useState } from "react";
import {getReceivedRequests,approveRequest,rejectRequest} from "../../api/request.api";
import "../../styles/requestReceived.css";

const RequestsReceived = () => {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getReceivedRequests();
      setRequests(data.requests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveRequest(id);

      // instant UI update
      setRequests(prev =>
        prev.map(r =>
          r._id === id ? { ...r, status: "approved" } : r
        )
      );

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequest(id);

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
    return <p>No requests received yet.</p>;

  return (
    <div className="requests-received">

  <div className="received-header">
    <span>Book Title</span>
    <span>Buyer Name</span>
    <span>Price</span>
    <span>Action</span>
  </div>

  {requests.map((req) => (
    <div key={req._id} className="received-row">

      <span>{req.bookId?.title}</span>

      <span>{req.buyerId?.name}</span>

      <span>₹{req.bookId?.price}</span>

      <span>
        {req.status === "pending" && (
          <>
            <button
              className="approve-btn"
              onClick={() => handleApprove(req._id)}
            >
              Approve
            </button>

            <button
              className="reject-btn"
              onClick={() => handleReject(req._id)}
            >
              Reject
            </button>
          </>
        )}

        {req.status === "approved" && (
          <span className="received-status approved">Approved</span>
        )}

        {req.status === "cancelled" && (
          <span className="received-status cancelled">Rejected</span>
        )}
      </span>

    </div>
  ))}
    </div>
  );
};

export default RequestsReceived;