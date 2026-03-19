import { useEffect, useState } from "react";
import { getProfile } from "../../api/auth.api";
import ChatBox from "../../component/chatBox";
import "../../styles/profileChat.css";

const ProfileChats = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const data = await getProfile();
      if (!data.user) return;
      setUser(data.user);

      // Combine sent + received requests
      const allRequests = [...data.receivedRequests, ...data.sentRequests];

      // Only approved requests
      const approvedRequests = allRequests.filter(r => r.status === "approved");

      // Deduplicate by other user's _id
      const userMap = new Map();

      approvedRequests.forEach(req => {
        if (!req.buyerId || !req.sellerId) return;

        // Safely get buyer and seller IDs
        const buyerId = req.buyerId._id?.toString() || req.buyerId?.toString();
        const sellerId = req.sellerId._id?.toString() || req.sellerId?.toString();

        // Determine other user
        let otherUser = null;
        if (buyerId === data.user._id.toString()) {
          otherUser = req.sellerId;
        } else if (sellerId === data.user._id.toString()) {
          otherUser = req.buyerId;
        } else {
          return; // skip if current user is neither buyer nor seller
        }

        // Keep the latest request per other user
        if (
          !userMap.has(otherUser._id) ||
          new Date(req.createdAt) > new Date(userMap.get(otherUser._id).request.createdAt)
        ) {
          userMap.set(otherUser._id, { otherUser, request: req });
        }
      });

      setRequests(Array.from(userMap.values()));
    } catch (err) {
      console.error("Failed to fetch profile chats:", err);
    }
  };

  return (
    <div className="chat-layout">
      {/* LEFT SIDE */}
      <div className="chat-list">
        {requests.map(({ otherUser, request }) => (
          <div
            key={request._id}
            className={`chat-user ${selectedRequest?._id === request._id ? "active" : ""}`}
            onClick={() => setSelectedRequest(request)}
          >
            {otherUser?.name || "Unknown User"}
          </div>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div className="chat-area">
        <ChatBox requestId={selectedRequest?._id} user={user} />
      </div>
    </div>
  );
};

export default ProfileChats;