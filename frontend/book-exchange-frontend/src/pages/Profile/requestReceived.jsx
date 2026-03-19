import { useEffect, useState } from "react";
import { getReceivedRequests, approveRequest, rejectRequest, markAsPaid } from "../../api/request.api";
import "../../styles/requestReceived.css";

const RequestsReceived = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

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
      setLoadingId(id);

      await approveRequest(id);

      setRequests(prev =>
        prev.map(r =>
          r._id === id ? { ...r, status: "approved" } : r
        )
      );
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setLoadingId(id);

      await rejectRequest(id);

      setRequests(prev =>
        prev.map(r =>
          r._id === id ? { ...r, status: "cancelled" } : r
        )
      );
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      setLoadingId(id);

      await markAsPaid(id);

      setRequests(prev =>
        prev.map(r =>
          r._id === id ? { ...r, status: "paid" } : r
        )
      );
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoadingId(null);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (requests.length === 0)
    return <p>No requests received yet.</p>;

  return (
    <div className="requests-received">

      {/* HEADER */}
      <div className="received-header">
        <span>Book Title</span>
        <span>Buyer Name</span>
        <span>Price</span>
        <span>Status</span>
        <span>Payment</span>
        <span>Action</span>
      </div>

      {/* ROWS */}
      {requests.map((req) => (
        <div key={req._id} className="received-row">

          <span>{req.bookId?.title}</span>

          <span>{req.buyerId?.name}</span>

          <span>₹{req.bookId?.price}</span>

          {/* STATUS */}
          <span className={`received-status ${req.status}`}>
            {req.status}
          </span>

          {/* PAYMENT MODE */}
          <span>
            {req.paymentMode ? (
              <span className={`received-payment ${req.paymentMode}`}>
                {req.paymentMode}
              </span>
            ) : (
              "-"
            )}
          </span>

          {/* ACTIONS */}
          <span>
            {/* Pending */}
            {req.status === "pending" && (
              <>
                <button
                  disabled={loadingId === req._id}
                  className="received-approve-btn"
                  onClick={() => handleApprove(req._id)}
                >
                  {loadingId === req._id ? "..." : "Approve"}
                </button>

                <button
                  disabled={loadingId === req._id}
                  className="received-reject-btn"
                  onClick={() => handleReject(req._id)}
                >
                  Reject
                </button>
              </>
            )}

            {/* Approved but waiting for payment */}
            {req.status === "approved" && !req.paymentMode && (
              <span>Waiting for buyer</span>
            )}

            {/* Approved + payment selected */}
            {req.status === "approved" && req.paymentMode && (
              <button
                disabled={loadingId === req._id}
                className="received-approve-btn"
                onClick={() => handleMarkPaid(req._id)}
              >
                {loadingId === req._id ? "..." : "Mark Paid"}
              </button>
            )}

            {/* Final states */}
            {req.status === "paid" && (
              <span className="received-status paid">Completed</span>
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