"use client";

import Head from "next/head";
import { useState } from "react";
import { db } from "../components/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FaUpload, FaImage } from "react-icons/fa";
import Net from "@/components/Net";

const API_KEY = "d3b627c6d75013b8aaf2aac6de73dcb5";

export default function Push() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const uploadedImages = [];

      for (let i = 0; i < images.length; i++) {
        const imageUrl = await uploadImage(images[i]);
        uploadedImages.push(imageUrl);
      }

      await addDoc(collection(db, "websites"), {
        name: name.trim(),
        description: description.trim(),
        previewUrl: previewUrl.trim(),
        price: Number(price),
        image: uploadedImages[0],
        images: uploadedImages,
        createdAt: serverTimestamp(),
      });

      setStatus("Website yabitswe neza ✅");

      setName("");
      setDescription("");
      setPreviewUrl("");
      setPrice("");
      setImages([]);
    } catch (error) {
      console.error(error);
      setStatus("Habaye ikibazo mu kubika ❌");
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Push Website | Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <Net />

      <main className="push-container">
        <form onSubmit={handleSubmit}>
          <h1>Ongeramo Website</h1>

          <input
            type="text"
            placeholder="Izina rya Website"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <textarea
            placeholder="Ibisobanuro bya Website"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Igiciro (RWF)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <input
            type="url"
            placeholder="Preview URL (https://...)"
            value={previewUrl}
            onChange={(e) => setPreviewUrl(e.target.value)}
            required
          />

          <label className="fileLabel">
            <FaImage /> Hitamo Ifoto / Amafoto
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => setImages(e.target.files)}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            <FaUpload />
            {loading ? "Biri kubikwa..." : "Bika Website"}
          </button>

          {status && <p className="status">{status}</p>}
        </form>
      </main>

      {/* =========================
          CSS yose muri component (responsive + theme aware)
      ========================== */}
      <style jsx>{`
        .push-container {
          max-width: 700px;
          margin: 80px auto;
          padding: 24px;
          background: var(--bg-card);
          color: var(--foreground);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
        }

        h1 {
          font-size: var(--text-2xl);
          margin-bottom: 16px;
          font-family: var(--font-display);
        }

        input, textarea {
          width: 100%;
          padding: 12px;
          margin-bottom: 12px;
          border: 1px solid var(--gray-300);
          border-radius: var(--radius-md);
          background: var(--bg-card);
          color: var(--foreground);
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(37,99,235,0.3);
        }

        .fileLabel {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          margin-bottom: 16px;
        }

        button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--primary);
          color: var(--text-light);
          border: none;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        button:hover:not(:disabled) {
          background: var(--primary-dark);
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .status {
          margin-top: 12px;
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        @media (max-width: 480px) {
          .push-container {
            margin: 20px 10px;
            padding: 16px;
          }

          input, textarea {
            padding: 10px;
          }

          button {
            padding: 10px;
          }
        }

        @media (min-width: 481px) and (max-width: 768px) {
          .push-container {
            padding: 20px;
          }

          input, textarea {
            padding: 12px;
          }

          button {
            padding: 12px;
          }
        }
      `}</style>
    </>
  );
}
