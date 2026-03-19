import { useEffect, useState, useRef } from "react";
import socket from "../socket";
import { sendMessage, getMessages } from "../api/chat.api";
import "../styles/chatBox.css";

const ChatBox = ({ requestId, user }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  // Load messages + join room
  useEffect(() => {
    if (!requestId) return;

    fetchMessages();

    // join room
    socket.emit("joinRoom", { requestId });

    // Listen for messages
    const handler = (msg) => {
      if (msg.requestId.toString() !== requestId.toString()) return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("receiveMessage", handler);

    return () => {
      socket.off("receiveMessage", handler);
    };
  }, [requestId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const data = await getMessages(requestId);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async () => {
    if (!text.trim() || !requestId) return;

    try {
      const msg = await sendMessage({ requestId, message: text });

      // Emit only the DB-saved message with proper _id
      socket.emit("sendMessage", msg);

      setMessages((prev) => [...prev, msg]);
      setText("");
    } catch (err) {
      alert("Message failed");
    }
  };

  return (
    <div className="chat-box">
      {!requestId ? (
        <div className="chat-empty">Select a chat</div>
      ) : (
        <>
          <div className="chat-messages">
            {messages.map((m) => {
              const isMe = m.senderId.toString() === user._id.toString();
              return (
                <div
                  key={m._id}
                  className={isMe ? "my-message" : "other-message"}
                >
                  {m.message}
                </div>
              );
            })}
            <div ref={bottomRef}></div>
          </div>

          <div className="chat-input">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type message..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;