import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const isLoggedIn = !!user;

   const handleLogout = () => {
    logout();        // clear user + token
    navigate("/");   // go to Explore
  };


  return (
    <header className="bt-header">
      {/* LOGO */}
    <div className="logo" onClick={() => navigate("/")} >
        <span className="logo-book">Book</span>
        <span className="logo-trade">Trade</span>
    </div>

      {/* NAV */}
      <nav className="center-nav">
        <a href="/home" className="nav-link">Explore</a>
        {isLoggedIn && (
        <a href="/addBook" className="nav-link">Add Book</a>
        )}
      </nav>

      {/* AUTH / PROFILE */}
      <div className="right">
        {isLoggedIn ? (
          <div className="profile-wrap">
            <div className="profile" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <a href="/login">Login</a>
            <a href="/register" className="signup">
              Signup
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
