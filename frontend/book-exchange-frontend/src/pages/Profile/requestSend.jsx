import { useEffect, useState } from "react";
import { getSentRequests, cancelRequest, choosePaymentMode } from "../../api/request.api";
import "../../styles/requestSend.css";

const RequestsSent = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getSentRequests();
      setRequests(data.requests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelRequest(id);

      setRequests(prev =>
        prev.map(r =>
          r._id === id ? { ...r, status: "cancelled" } : r
        )
      );
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const choosePayment = async (id, mode) => {
    try {
      setLoadingId(id);

      await choosePaymentMode(id, mode);

      setRequests(prev =>
        prev.map(r =>
          r._id === id ? { ...r, paymentMode: mode } : r
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
    return <p>No requests sent yet.</p>;

  return (
    <div className="requests-sent">

      {/* Header */}
      <div className="sent-header">
        <span>Book Title</span>
        <span>Seller Name</span>
        <span>Price</span>
        <span>Status</span>
        <span>Action</span>
        <span>Payment Mode</span>
      </div>

      {/* Rows */}
      {requests.map((req) => (
        <div key={req._id} className="sent-row">

          <span>{req.bookId?.title}</span>

          <span>{req.sellerId?.name}</span>

          <span>₹{req.bookId?.price}</span>

          <span className={`sent-status ${req.status}`}>
            {req.status}
          </span>

          {/* Cancel Button */}
          <span>
            {req.status === "pending" ? (
              <button
                className="sent-cancel-btn"
                onClick={() => handleCancel(req._id)}
              >
                Cancel
              </button>
            ) : (
              "-"
            )}
          </span>

          {/* Payment Column */}
            <span>
              {/* Show buttons only if approved and not selected */}
              {req.status === "approved" && !req.paymentMode && (
                <>
                  <button
                    disabled={loadingId === req._id}
                    className="sent-online-btn"
                    onClick={() => choosePayment(req._id, "online")}
                  >
                    {loadingId === req._id ? "..." : "Online"}
                  </button>

                  <button
                    disabled={loadingId === req._id}
                    className="sent-offline-btn"
                    onClick={() => choosePayment(req._id, "offline")}
                  >
                    {loadingId === req._id ? "..." : "Offline"}
                  </button>
                </>
              )}

              {/* Show selected mode */}
              {req.paymentMode && (
                <>
                  {req.paymentMode === "online" ? (
                    <span className="sent-payment online">
                      Online | {req.sellerId?.phone || "N/A"}
                    </span>
                  ) : (
                    <span className="sent-payment offline">
                      Offline | <button
                        className="go-to-chat-btn"
                        onClick={() => {
                          // Navigate to chat section
                          // Replace with your navigation logic, e.g., react-router
                          window.location.href = `/profile/chats?requestId=${req._id}`;
                        }}
                      >
                        Go to Chat
                      </button>
                    </span>
                  )}
                </>
              )}

              {/* Default fallback */}
              {(req.status === "pending" || req.status === "cancelled") && "-"}
            </span>
        </div>
      ))}
    </div>
  );
};

export default RequestsSent;