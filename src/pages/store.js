'use client';

import React, { useState } from "react";
import { db } from "@/components/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useTheme } from "@/components/theme";
import styles from "@/styles/store.module.css";

/* ======================
   🧠 Helper: text → HTML
====================== */
function formatEpisode(text = "") {
  let safe = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  safe = safe.replace(/\n\s*\n/g, "</p><p>");
  safe = safe.replace(/\n/g, "<br />");

  return `<p>${safe}</p>`;
}

export default function Store({ stories }) {
  const { theme } = useTheme();
  const [selectedStory, setSelectedStory] = useState("");
  const [episodes, setEpisodes] = useState([]);

  const loadEpisodes = async (storyId) => {
    setEpisodes([]);
    if (!storyId) return;

    const snap = await getDoc(doc(db, "stories", storyId));
    if (snap.exists()) {
      setEpisodes(snap.data().episodes || []);
    }
  };

  const copyText = async (text) => {
    await navigator.clipboard.writeText(text);
    alert("Episode copied!");
  };

  return (
    <div className={styles.container}>
      {/* 🔽 SELECT STORY */}
      <div className={styles.selectBox}>
        <h1 className={styles.title}>Store of Stories</h1>

        <select
          className={styles.select}
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
      <div className={styles.posts}>
        {episodes.length === 0 && selectedStory && (
          <p className={styles.empty}>Nta episodes ziboneka</p>
        )}

        {episodes.map((ep, index) => (
          <div className={styles.post} key={index}>
            <h3 className={styles.episodeTitle}>
              Episode {index + 1}
            </h3>

            <div
              className={styles.content}
              dangerouslySetInnerHTML={{
                __html: formatEpisode(ep),
              }}
            />

            <button
              className={styles.copyBtn}
              onClick={() => copyText(ep)}
            >
              Copy
            </button>
          </div>
        ))}
      </div>
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
