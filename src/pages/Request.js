"use client";

import React, { useState } from "react";
import { db } from "../components/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export async function getServerSideProps() {
  const snap = await getDocs(collection(db, "monetization_requests"));
  const requests = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.().toISOString() || null,
  }));

  return { props: { initialRequests: requests } };
}

export default function AdminRequests({ initialRequests }) {
  const [requests, setRequests] = useState(initialRequests);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Uremeza ko ushaka gusiba iyi request?");
    if (!confirmDelete) return;

    try {
      setDeleting(id);
      await deleteDoc(doc(db, "monetization_requests", id));
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      console.error(err);
      setError(`Firestore Error: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Monetization Requests</h2>
      {error && <p className="error">{error}</p>}

      {requests.length === 0 ? (
        <p className="empty">Nta requests zirimo muri database.</p>
      ) : (
        <div className="grid">
          {requests.map((req) => (
            <div key={req.id} className="card">
              <h3>{req.fullName}</h3>
              <p><strong>Username:</strong> {req.username}</p>
              <p><strong>WhatsApp:</strong> {req.whatsapp}</p>
              <p><strong>Email:</strong> {req.email}</p>
              <p><strong>Reason:</strong> {req.reason}</p>
              <p><strong>Date:</strong> {req.createdAt || "N/A"}</p>

              <div className="images">
                {req.idCardUrl && <img src={req.idCardUrl} alt="ID" />}
                {req.profilePhotoUrl && <img src={req.profilePhotoUrl} alt="Profile" />}
                {req.screenshotStoriesUrl && <img src={req.screenshotStoriesUrl} alt="Stories" />}
                {req.screenshotReferUrl && <img src={req.screenshotReferUrl} alt="Refer" />}
              </div>

              <button
                className="deleteButton"
                onClick={() => handleDelete(req.id)}
                disabled={deleting === req.id}
              >
                {deleting === req.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .container {
          margin-top: 60px;
          margin-bottom: 120px;
          padding: 16px;
          min-height: 100vh;
          background: var(--background);
          color: var(--foreground);
          font-family: var(--font-sans);
        }

        .title {
          text-align: center;
          margin-bottom: 24px;
          font-size: 1.8rem;
          color: var(--primary);
        }

        .error {
          color: red;
          text-align: center;
          margin-bottom: 12px;
        }

        .empty {
          text-align: center;
          opacity: 0.7;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 18px;
        }

        .card {
          background: var(--bg-card);
          padding: 16px;
          border-radius: 14px;
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .card h3 {
          margin: 0;
          color: var(--primary);
        }

        .images {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 8px 0;
        }

        .images img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
        }

        .deleteButton {
          background: var(--danger);
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          align-self: flex-start;
        }

        .deleteButton:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .deleteButton:hover:enabled {
          opacity: 0.9;
        }

        @media (max-width: 600px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
