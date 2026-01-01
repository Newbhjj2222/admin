// pages/folder.js
'use client';

import React, { useState } from "react";
import { db } from "@/components/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useTheme } from "@/components/theme";
import styles from "@/styles/folder.module.css";

export default function FolderPage({ foldersServer }) {
  const { theme } = useTheme();
  const [folders, setFolders] = useState(foldersServer || []);
  const [search, setSearch] = useState("");

  const filteredFolders = folders.filter(f =>
    f.title?.toLowerCase().includes(search.toLowerCase()) ||
    f.author?.toLowerCase().includes(search.toLowerCase())
  );

  const loadFolders = async () => {
    const snapshot = await getDocs(collection(db, "folders"));
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    setFolders(data);
  };

  const toggleHidden = async (id, hidden) => {
    await updateDoc(doc(db, "folders", id), { hidden: !hidden });
    loadFolders();
  };

  const editFolder = async (id, folder) => {
    const title = prompt("Enter new title", folder.title || "");
    if (title === null) return;
    const author = prompt("Enter new author", folder.author || "");
    if (author === null) return;
    await updateDoc(doc(db, "folders", id), { title, author });
    loadFolders();
  };

  const deleteFolder = async (id) => {
    if (!confirm("Delete this folder?")) return;
    await deleteDoc(doc(db, "folders", id));
    loadFolders();
  };

  return (
    <div className={styles.container}>
      <div className={styles.giver}>
        <h1 className={styles.title}>Folders Manager</h1>

        <input
          className={styles.searchInput}
          placeholder="Shaka title cyangwa author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className={styles.primaryBtn} onClick={loadFolders}>
          Refresh
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
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
                <td colSpan="4" className={styles.empty}>
                  No folders found
                </td>
              </tr>
            ) : (
              filteredFolders.map(folder => (
                <tr
                  key={folder.id}
                  className={folder.hidden ? styles.hiddenRow : ""}
                >
                  <td>{folder.title || "(No Title)"}</td>
                  <td>{folder.author || "(No Author)"}</td>
                  <td>{folder.hidden ? "Hidden" : "Visible"}</td>
                  <td className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => editFolder(folder.id, folder)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.hideBtn}
                      onClick={() => toggleHidden(folder.id, folder.hidden)}
                    >
                      {folder.hidden ? "Show" : "Hide"}
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteFolder(folder.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ================= SSR =================
export async function getServerSideProps() {
  const snapshot = await getDocs(collection(db, "folders"));
  const folders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  return { props: { foldersServer: folders } };
}
