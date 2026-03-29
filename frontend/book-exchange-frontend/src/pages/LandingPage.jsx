import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="container">

      {/* 🔥 Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h2>Turn Your Old Books Into Value</h2>
          <p>
            Buy, sell, or exchange books with students around you — fast,
            simple, and affordable.
          </p>

          <div className="hero-buttons">
            <button 
              className="btn-primary"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>

            <button 
              className="btn-outline"
              onClick={() => navigate("/home")}
            >
              Browse Books
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://illustrations.popsy.co/gray/work-from-home.svg"
            alt="books"
          />
        </div>
      </section>

      {/* Problem Section */}
      <section className="section light">
        <h3>Struggling with unused books?</h3>
        <div className="grid">
          <div className="card">Books pile up after semester 📚</div>
          <div className="card">Selling is hard 😓</div>
          <div className="card">New books are expensive 💸</div>
          <div className="card">No trusted marketplace ❌</div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="section">
        <h3>BookTrade makes it simple</h3>
        <div className="grid">
          <div className="card light-card">Sell books in minutes</div>
          <div className="card light-card">Connect with buyers</div>
          <div className="card light-card">Affordable for students</div>
          <div className="card light-card">Safe & transparent</div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section light">
        <h3>How It Works</h3>
        <div className="grid three">
          <div className="card">📤 List your book</div>
          <div className="card">🤝 Get requests</div>
          <div className="card">💰 Sell or exchange</div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h3>Stop letting your books gather dust</h3>
        <div>

          <button 
            className="btn-outline"
            onClick={() => navigate("/home")}
          >
            Explore Marketplace
          </button>
        </div>
      </section>

    </div>
  );
}