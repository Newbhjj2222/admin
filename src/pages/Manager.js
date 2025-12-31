"use client";

import Head from "next/head";
import Net from "@/components/Net";
import { db } from "@/components/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { useState } from "react";
import { FaTrashAlt, FaExternalLinkAlt } from "react-icons/fa";

/* =========================
   COMPONENT
========================= */
export default function Manager({ websites }) {
  const [items, setItems] = useState(websites);
  const [loadingId, setLoadingId] = useState(null);

  /* ---------- DELETE ---------- */
  const handleDelete = async (id) => {
    if (!confirm("Urashaka gusiba iyi website?")) return;

    try {
      setLoadingId(id);
      await deleteDoc(doc(db, "websites", id));
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Habaye ikibazo mu gusiba ❌");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <Head>
        <title>Manager | Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <Net />

      <main className="manager">
        <h1>Websites Zose</h1>

        {items.length === 0 ? (
          <p className="empty">Nta website irabikwa</p>
        ) : (
          <div className="grid">
            {items.map((site) => (
              <div className="card" key={site.id}>
                <img
                  src={site.image}
                  alt={site.name}
                  className="thumb"
                />

                <div className="content">
                  <h2>{site.name}</h2>
                  <p className="desc">{site.description}</p>

                  <div className="meta">
                    <span className="price">
                      {site.price?.toLocaleString()} RWF
                    </span>

                    <a
                      href={site.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="preview"
                    >
                      Preview <FaExternalLinkAlt />
                    </a>
                  </div>

                  <button
                    className="deleteBtn"
                    onClick={() => handleDelete(site.id)}
                    disabled={loadingId === site.id}
                  >
                    <FaTrashAlt />
                    {loadingId === site.id ? " Gusiba..." : " Siba"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* =========================
          CSS (THEME + RESPONSIVE)
      ========================== */}
      <style jsx>{`
        .manager {
          max-width: 1200px;
          margin: 80px auto;
          padding: 0 16px;
          color: var(--foreground);
        }

        h1 {
          font-family: var(--font-display);
          font-size: var(--text-3xl);
          margin-bottom: 24px;
        }

        .empty {
          color: var(--text-muted);
          text-align: center;
          margin-top: 40px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .card {
          background: var(--bg-card);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease;
        }

        .card:hover {
          transform: translateY(-4px);
        }

        .thumb {
          width: 100%;
          height: 160px;
          object-fit: cover;
          background: var(--bg-muted);
        }

        .content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        h2 {
          font-size: var(--text-lg);
          margin: 0;
        }

        .desc {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.5;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 6px;
        }

        .price {
          font-weight: bold;
          color: var(--success);
        }

        .preview {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: var(--text-sm);
        }

        .deleteBtn {
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--danger);
          color: var(--text-light);
          border: none;
          padding: 10px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: opacity 0.3s ease;
        }

        .deleteBtn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .deleteBtn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ---------- MOBILE ---------- */
        @media (max-width: 480px) {
          h1 {
            font-size: var(--text-2xl);
          }

          .thumb {
            height: 140px;
          }
        }
      `}</style>
    </>
  );
}

/* =========================
   SSR
========================= */
export async function getServerSideProps() {
  const q = query(
    collection(db, "websites"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  const websites = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    props: {
      websites,
    },
  };
}
