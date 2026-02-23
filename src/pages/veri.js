import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";

export async function getServerSideProps() {
  const snapshot = await getDocs(collection(db, "authors"));

  const authors = snapshot.docs.map((doc) => ({
    username: doc.id, // 👈 doc id ni username
    ...doc.data(),
  }));

  return {
    props: { authors },
  };
}

export default function AdminAuthors({ authors }) {
  const [loadingId, setLoadingId] = useState(null);

  const toggleBadge = async (username, currentStatus) => {
    setLoadingId(username);

    await fetch("/api/toggle-badge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        badge: currentStatus === "verified" ? "unverified" : "verified",
      }),
    });

    window.location.reload();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Authors Management</h2>

      <div className="grid">
        {authors.map((author) => (
          <div key={author.username} className="card">
            <h3>{author.username}</h3>

            <p>
              Status:{" "}
              <strong
                style={{
                  color:
                    author.badge === "verified" ? "green" : "red",
                }}
              >
                {author.badge || "unverified"}
              </strong>
            </p>

            <button
              onClick={() =>
                toggleBadge(author.username, author.badge)
              }
              disabled={loadingId === author.username}
            >
              {author.badge === "verified"
                ? "Make Unverified"
                : "Make Verified"}
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .grid {
          display: grid;
          margin-top: 80px;
          margin-bottom: 140px;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        .card {
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          background: #fff;
        }
        button {
          padding: 8px 15px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          background: black;
          color: white;
        }
      `}</style>
    </div>
  );
}
