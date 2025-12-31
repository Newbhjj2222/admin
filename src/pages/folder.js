// pages/folder.js
'use client';
import React, { useState } from "react";
import { db } from "@/components/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useTheme } from "@/components/theme";

export default function FolderPage({ foldersServer }) {
  const { theme } = useTheme();
  const [folders, setFolders] = useState(foldersServer || []);
  const [search, setSearch] = useState("");

  const filteredFolders = folders.filter(f =>
    f.title?.toLowerCase().includes(search.toLowerCase()) ||
    f.author?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleHidden = async (id, currentHidden) => {
    try {
      await updateDoc(doc(db, "folders", id), { hidden: !currentHidden });
      loadFolders();
    } catch (err) {
      console.error(err);
      alert("Habaye ikosa mu guhindura status.");
    }
  };

  const editFolder = async (id, folder) => {
    const newTitle = prompt("Enter new title:", folder.title || "");
    if (newTitle === null) return;
    const newAuthor = prompt("Enter new author:", folder.author || "");
    if (newAuthor === null) return;
    try {
      await updateDoc(doc(db, "folders", id), { title: newTitle, author: newAuthor });
      loadFolders();
    } catch (err) {
      console.error(err);
      alert("Habaye ikosa mu guhindura folder.");
    }
  };

  const deleteFolder = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this folder?");
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, "folders", id));
      loadFolders();
    } catch (err) {
      console.error(err);
      alert("Habaye ikosa mu gusiba folder.");
    }
  };

  const loadFolders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "folders"));
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setFolders(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      
      <div className="giver">
        <h1>Folders Manager</h1>

        <input
          type="text"
          placeholder="Shaka title cyangwa author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="searchInput"
        />

        <button onClick={loadFolders}>Refresh</button>
      </div>

      <div className="tableWrapper">
        <table className="foldersTable">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFolders.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", color: "#555" }}>
                  No folders found
                </td>
              </tr>
            ) : (
              filteredFolders.map(folder => (
                <tr key={folder.id} className={folder.hidden ? "hiddenRow" : ""}>
                  <td>{folder.title || "(No Title)"}</td>
                  <td>{folder.author || "(No Author)"}</td>
                  <td>{folder.hidden ? "Hidden" : "Visible"}</td>
                  <td>
                    <button className="editBtn" onClick={() => editFolder(folder.id, folder)}>Edit</button>
                    <button className="hideBtn" onClick={() => toggleHidden(folder.id, folder.hidden)}>
                      {folder.hidden ? "Show" : "Hide"}
                    </button>
                    <button className="deleteBtn" onClick={() => deleteFolder(folder.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .container {
          padding: 20px;
          margin-top: 50px;
          min-height: 100vh;
          background: var(--background);
          color: var(--foreground);
          font-family: var(--font-sans);
        }
        .giver {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          background: var(--bg-card);
          padding: 16px;
          border-radius: var(--radius-lg);
          margin-bottom: 20px;
          box-shadow: var(--shadow-md);
        }
        .searchInput {
          padding: 6px 10px;
          margin: 4px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--gray-300);
          font-size: var(--text-base);
          background: var(--bg-card);
          color: var(--foreground);
        }
        button {
          padding: 6px 12px;
          border: none;
          border-radius: var(--radius-sm);
          background: var(--primary);
          color: var(--text-light);
          cursor: pointer;
          transition: background 0.2s;
          margin-left: 4px;
        }
        button:hover {
          background: var(--primary-dark);
        }
        .tableWrapper {
          overflow-x: auto;
        }
        .foldersTable {
          width: 100%;
          border-collapse: collapse;
          min-width: 500px;
        }
        .foldersTable th, .foldersTable td {
          padding: 10px;
          border: 1px solid var(--gray-300);
          text-align: left;
          white-space: nowrap;
        }
        .foldersTable th {
          background: var(--primary);
          color: var(--text-light);
        }
        .foldersTable td {
          background: var(--bg-card);
        }
        .hiddenRow td {
          background-color: #f9d6d5;
          opacity: 0.6;
        }
        @media (max-width: 768px) {
          .foldersTable th, .foldersTable td {
            font-size: 0.85rem;
            padding: 6px;
          }
        }
        @media (max-width: 480px) {
          .foldersTable th, .foldersTable td {
            font-size: 0.8rem;
            padding: 4px;
          }
        }
      `}</style>
    </div>
  );
}

// ================= SSR =================
export async function getServerSideProps() {
  try {
    const snapshot = await getDocs(collection(db, "folders"));
    const folders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return { props: { foldersServer: folders } };
  } catch (err) {
    console.error("Error fetching folders:", err);
    return { props: { foldersServer: [] } };
  }
}
