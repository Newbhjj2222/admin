'use client';

import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/components/firebase";
import { useTheme } from "@/components/theme";


export default function Bible() {
  const { theme } = useTheme();

  const [verseRef, setVerseRef] = useState("");
  const [verseText, setVerseText] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verseRef || !verseText) {
      setStatus("Uzuza ibisabwa byose ❗");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "bible"), {
        verse: verseRef,
        text: verseText,
        createdAt: serverTimestamp(),
      });

      setStatus("Verse yoherejwe neza ✅");
      setVerseRef("");
      setVerseText("");
    } catch (err) {
      console.error(err);
      setStatus("Hari ikibazo cyo kohereza verse ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      

      <div className="card">
        <h1>Send Bible Verse</h1>

        <form onSubmit={handleSubmit}>
          <label>Verse Reference</label>
          <input
            type="text"
            placeholder="Ex: Zaburi 29:2"
            value={verseRef}
            onChange={(e) => setVerseRef(e.target.value)}
          />

          <label>Verse Text</label>
          <textarea
            placeholder="Mwubahe Uwiteka..."
            value={verseText}
            onChange={(e) => setVerseText(e.target.value)}
          />

          <button disabled={loading}>
            {loading ? "Sending..." : "Send Verse"}
          </button>
        </form>

        {status && <p className="status">{status}</p>}
      </div>

      {/* 🎨 THEME-AWARE STYLES */}
      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 16px;
          background: var(--background);
          color: var(--foreground);
          font-family: var(--font-sans);
        }

        .card {
          width: 100%;
          max-width: 520px;
          background: var(--bg-card);
          padding: 24px;
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

        label {
          font-size: var(--text-sm);
          font-weight: 600;
        }

        input,
        textarea {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          font-size: var(--text-base);
          border: 1px solid var(--gray-300);
          background: var(--background);
          color: var(--foreground);
        }

        textarea {
          min-height: 120px;
          resize: vertical;
        }

        button {
          margin-top: 8px;
          background: var(--primary);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .status {
          margin-top: 12px;
          text-align: center;
          font-weight: 600;
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
