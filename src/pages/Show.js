'use client';

import React, { useState } from "react";
import { db } from "@/components/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useTheme } from "@/components/theme";

export default function Show() {
  const { theme } = useTheme();
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) {
      setStatus("Andika content yawe mbere yo kohereza.");
      return;
    }

    try {
      await addDoc(collection(db, "shows"), {
        content,
        videoUrl,
        createdAt: new Date()
      });
      setStatus("Byoherejwe neza ✅");
      setContent("");
      setVideoUrl("");
    } catch (err) {
      console.error(err);
      setStatus("Habaye ikosa mu kohereza ❌");
    }
  };

  return (
    <div className="container">
      
      <h2>Ohereza Content na Video</h2>

      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="content">Andika content yawe:</label>
        <textarea
          id="content"
          rows="6"
          placeholder="Andika inkuru cyangwa ibisobanuro..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <label htmlFor="videoUrl">Shyiramo video URL (YouTube cyangwa indi):</label>
        <input
          type="url"
          id="videoUrl"
          placeholder="https://example.com/video"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />

        <button type="submit">Ohereza</button>
      </form>

      {status && <p className="status">{status}</p>}

      <style jsx>{`
        .container {
          padding: 16px;
          min-height: 100vh;
          background: var(--background);
          color: var(--foreground);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        h2 {
          margin-bottom: 20px;
          text-align: center;
        }

        .form {
          width: 100%;
          max-width: 600px;
          background: var(--bg-card);
          padding: 24px;
          border-radius: 12px;
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        label {
          font-weight: 600;
        }

        textarea, input {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid var(--gray-300);
          font-size: var(--text-base);
          background: var(--bg-card);
          color: var(--foreground);
        }

        button {
          background: var(--primary);
          color: white;
          padding: 10px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: var(--text-base);
        }

        button:hover {
          opacity: 0.9;
        }

        .status {
          margin-top: 12px;
          text-align: center;
          font-weight: 600;
          color: var(--primary);
        }

        @media (max-width: 600px) {
          .form {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
