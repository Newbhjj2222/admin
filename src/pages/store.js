'use client';

import React, { useState } from "react";
import { db } from "@/components/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useTheme } from "@/components/theme";
import Net from "@/components/Net";

/* ======================
   🧠 Helper: text → HTML
====================== */
function formatEpisode(text = "") {
  // Escape basic HTML injection
  let safe = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Paragraphs (double line break)
  safe = safe.replace(/\n\s*\n/g, "</p><p>");

  // Single line break
  safe = safe.replace(/\n/g, "<br />");

  return `<p>${safe}</p>`;
}

export default function Store({ stories }) {
  const { theme } = useTheme();
  const [selectedStory, setSelectedStory] = useState("");
  const [episodes, setEpisodes] = useState([]);

  /* ======================
     📥 Load Episodes
  ====================== */
  const loadEpisodes = async (storyId) => {
    setEpisodes([]);
    if (!storyId) return;

    const snap = await getDoc(doc(db, "stories", storyId));
    if (snap.exists()) {
      setEpisodes(snap.data().episodes || []);
    }
  };

  /* ======================
     📋 Copy Episode
  ====================== */
  const copyText = async (text) => {
    await navigator.clipboard.writeText(text);
    alert("Episode copied!");
  };

  return (
    <div className="container">
      <Net />

      {/* 🔽 SELECT STORY */}
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

      {/* 📚 EPISODES */}
      <div className="posts">
        {episodes.length === 0 && selectedStory && (
          <p className="empty">Nta episodes ziboneka</p>
        )}

        {episodes.map((ep, index) => (
          <div className="post" key={index}>
            <h3>Episode {index + 1}</h3>

            <div
              className="content"
              dangerouslySetInnerHTML={{
                __html: formatEpisode(ep),
              }}
            />

            <button onClick={() => copyText(ep)}>Copy</button>
          </div>
        ))}
      </div>

      {/* 🎨 STYLES */}
      <style jsx>{`
        .container {
          padding: 16px;
          min-height: 100vh;
          background: var(--background);
          color: var(--foreground);
          font-family: var(--font-sans);
        }

        /* SELECT */
        .selectBox {
          max-width: 520px;
          margin: auto;
          background: var(--bg-card);
          padding: 16px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: var(--shadow-md);
        }

        h1 {
          text-align: center;
          margin: 0;
        }

        select {
          padding: 10px;
          border-radius: 8px;
          font-size: var(--text-base);
          background: var(--bg-card);
          color: var(--foreground);
          border: 1px solid var(--gray-300);
        }

        /* POSTS */
        .posts {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 18px;
        }

        .post {
          background: var(--bg-card);
          padding: 16px;
          border-radius: 14px;
          border-left: 6px solid var(--primary);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .post h3 {
          margin: 0;
          color: var(--primary);
          font-size: 1rem;
        }

        /* 📝 FORMATTED TEXT */
        .content {
          font-size: 0.95rem;
          line-height: 1.7;
        }

        .content p {
          margin: 0 0 12px 0;
        }

        .content br {
          line-height: 1.7;
        }

        /* BUTTON */
        button {
          align-self: flex-start;
          background: var(--primary);
          color: white;
          border: none;
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
        }

        button:hover {
          opacity: 0.9;
        }

        .empty {
          text-align: center;
          opacity: 0.7;
          grid-column: 1 / -1;
        }

        /* 📱 MOBILE */
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

/* ======================
   🌍 SSR
====================== */
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
