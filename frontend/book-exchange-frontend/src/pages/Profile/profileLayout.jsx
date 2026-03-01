import { NavLink, Outlet } from "react-router-dom";
import { getProfile } from "../../api/auth.api.js";
import { useEffect, useState } from "react";
import "../../styles/profileLayout.css";

export default function ProfileLayout() {
  const [profileData, setProfileData] = useState(null);

  const setMyBooks = (updatedBooks) => {
  setProfileData((prev) => ({
    ...prev,
    myBooks:
      typeof updatedBooks === "function"
        ? updatedBooks(prev.myBooks)
        : updatedBooks,
  }));
};

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();  //  CALLING BACKEND
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!profileData) return <div>Error loading profile</div>;

  return (
    <div className="profile-container">

      {/* Sidebar */}
      <aside className="profile-sidebar">
        <h2 className="profile-title">
          Welcome, {profileData.user.name}
        </h2>

        <nav className="profile-nav">
          <NavLink to="my-books" className="profile-link">
            My Books
          </NavLink>

          <NavLink to="requests-received" className="profile-link">
            Requests Received
          </NavLink>

          <NavLink to="requests-sent" className="profile-link">
            Requests Sent
          </NavLink>

          <NavLink to="chats" className="profile-link">
            Chats
          </NavLink>

          <NavLink to="change-number" className="profile-link">
            Change Number
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="profile-content">
        <Outlet context={{profileData, myBooks:profileData.myBooks,setMyBooks}} /> {/* Passing data */}
      </main>

    </div>
  );
}
