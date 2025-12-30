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

      <main className="container bg-card text-dark shadow-md rounded-md">
        <form className="p-6" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-display mb-4">Ongeramo Website</h1>

          <input
            type="text"
            placeholder="Izina rya Website"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mb-3 rounded-md border border-gray-300 focus:ring focus:ring-primary"
            required
          />

          <textarea
            placeholder="Ibisobanuro bya Website"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 mb-3 rounded-md border border-gray-300 focus:ring focus:ring-primary"
            required
          />

          <input
            type="number"
            placeholder="Igiciro (RWF)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 mb-3 rounded-md border border-gray-300 focus:ring focus:ring-primary"
            required
          />

          <input
            type="url"
            placeholder="Preview URL (https://...)"
            value={previewUrl}
            onChange={(e) => setPreviewUrl(e.target.value)}
            className="w-full p-3 mb-3 rounded-md border border-gray-300 focus:ring focus:ring-primary"
            required
          />

          <label className="fileLabel flex items-center gap-2 cursor-pointer mb-4">
            <FaImage />
            Hitamo Ifoto / Amafoto
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => setImages(e.target.files)}
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-light p-3 rounded-md hover:bg-primary-dark transition"
          >
            <FaUpload />
            {loading ? "Biri kubikwa..." : "Bika Website"}
          </button>

          {status && <p className="mt-3 text-sm text-muted">{status}</p>}
        </form>
      </main>
    </>
  );
}
