'use client';

import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/components/firebase";
import { useTheme } from "@/components/theme";

export default function AddTeam() {
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ======================
     🖼️ IMAGE → BASE64
  ====================== */
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  /* ======================
     ➕ ADD TEAM MEMBER
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !tel || !image) {
      alert("Uzuza ibisabwa byose ❗");
      return;
    }

    try {
      setLoading(true);

      const photoBase64 = await toBase64(image);

      await addDoc(collection(db, "Team"), {
        name,
        whatsapp: tel,
        photo: photoBase64,
        createdAt: serverTimestamp(),
      });

      alert("Team member yongewemo neza ✅");

      setName("");
      setTel("");
      setImage(null);
      e.target.reset();
    } catch (err) {
      console.error(err);
      alert("Habaye ikosa ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      

      <div className="card">
        <h1>Add Team Member</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Author name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Phone / WhatsApp..."
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </button>
        </form>
      </div>

      {/* 🎨 STYLES */}
      <style jsx>{`
        .container {
          margin-top: 50px;
          margin-bottom: 120px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--background);
          color: var(--foreground);
          font-family: var(--font-sans);
          padding: 16px;
        }

        .card {
          width: 100%;
          max-width: 420px;
          background: var(--bg-card);
          padding: 20px;
          border-radius: 16px;
          box-shadow: var(--shadow-md);
        }

        h1 {
          text-align: center;
          margin-bottom: 16px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        input {
          padding: 10px;
          border-radius: 8px;
          font-size: var(--text-base);
          border: 1px solid var(--gray-300);
          background: var(--background);
          color: var(--foreground);
        }

        input[type="file"] {
          padding: 6px;
        }

        button {
          background: var(--primary);
          color: white;
          border: none;
          padding: 10px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        button:hover:not(:disabled) {
          opacity: 0.9;
        }

        /* 📱 MOBILE */
        @media (max-width: 480px) {
          .card {
            padding: 16px;
          }

          h1 {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}
