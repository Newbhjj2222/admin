'use client';

import React, { useState } from "react";
import { db } from "@/components/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useTheme } from "@/components/theme";
import Net from "@/components/Net";

export default function Store({ stories }) {
  const { theme } = useTheme();
  const [selectedStory, setSelectedStory] = useState("");
  const [episodes, setEpisodes] = useState([]);

  // Load episodes (client-side)
  const loadEpisodes = async (storyId) => {
    setEpisodes([]);
    if (!storyId) return;

    const snap = await getDoc(doc(db, "stories", storyId));
    if (snap.exists()) {
      setEpisodes(snap.data().episodes || []);
    }
  };

  // Copy episode
  const copyText = async (text) => {
    await navigator.clipboard.writeText(text);
    alert("Episode copied!");
  };

  return (
    <div className="container">
      <Net />

      <div className="selectBox">
        <h1>Store of Stories</h1>

        <select
          value={selectedStory}
          onChange={(e) => {
            setSelectedStory(e.target.value);
            loadEpisodes(e.target.value);
          }}
        >
          <option value="">-- Hitamo Inkuru --</option>
          {stories.map((s) => (
            <option key={s.id} value={s.id}>
              {s.storyName || s.id}
            </option>
          ))}
        </select>
      </div>

      <div className="posts">
        {episodes.length === 0 && selectedStory && (
          <p className="empty">Nta episodes ziboneka</p>
        )}

        {episodes.map((ep, index) => (
          <div className="post" key={index}>
            <h3>Episode {index + 1}</h3>
            <p>{ep}</p>
            <button onClick={() => copyText(ep)}>Copy</button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .container {
          padding: 16px;
          min-height: 100vh;
          background: var(--background);
          color: var(--foreground);
        }

        .selectBox {
          max-width: 520px;
          margin: auto;
          background: var(--bg-card);
          padding: 16px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: var(--shadow-md);
        }

        h1 {
          text-align: center;
        }

        select {
          padding: 10px;
          border-radius: 8px;
          font-size: var(--text-base);
          background: var(--bg-card);
          color: var(--foreground);
          border: 1px solid var(--gray-300);
        }

        .posts {
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
        }

        .post {
          background: var(--bg-card);
          padding: 14px;
          border-radius: 12px;
          border-left: 5px solid var(--primary);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .post h3 {
          margin: 0;
          color: var(--primary);
        }

        .post p {
          white-space: pre-wrap;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        button {
          align-self: flex-start;
          background: var(--primary);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        button:hover {
          opacity: 0.9;
        }

        .empty {
          text-align: center;
          opacity: 0.7;
        }

        /* 📱 Mobile */
        @media (max-width: 600px) {
          .posts {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}

/* ================= SSR ================= */
export async function getServerSideProps() {
  const snap = await getDocs(collection(db, "stories"));
  const stories = snap.docs.map((d) => ({
    id: d.id,
    storyName: d.data().storyName || d.data().title || null,
  }));

  return {
    props: { stories },
  };
}
