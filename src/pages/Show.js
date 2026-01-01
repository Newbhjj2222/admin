'use client';

import React, { useState } from "react";
import { db } from "@/components/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useTheme } from "@/components/theme";
import styles from "@/styles/show.module.css";

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
        createdAt: new Date(),
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
    <div className={styles.container}>
      <h2 className={styles.title}>Ohereza Content na Video</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="content">Andika content yawe:</label>
          <textarea
            id="content"
            rows="6"
            placeholder="Andika inkuru cyangwa ibisobanuro..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="videoUrl">
            Shyiramo video URL (YouTube cyangwa indi):
          </label>
          <input
            type="url"
            id="videoUrl"
            placeholder="https://example.com/video"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.button}>
          Ohereza
        </button>
      </form>

      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
}
