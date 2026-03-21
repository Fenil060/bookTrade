import { useState } from "react";
import { updatePhone } from "../../api/auth.api.js";
import "../../styles/updatePhone.css";

const ChangePhone = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!phone) return alert("Enter phone number");

    try {
      setLoading(true);
      const res = await updatePhone(phone);
      alert(res.message);
      setPhone("");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-phone">
      <h2>Change Phone Number</h2>

      <input
        type="text"
        placeholder="Enter new phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Update Number"}
      </button>
    </div>
  );
};

export default ChangePhone;