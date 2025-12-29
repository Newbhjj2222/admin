// pages/index.js
import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import * as cookie from "cookie";

import { db } from "@/components/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  deleteDoc,
  doc,
} from "firebase/firestore";

import styles from "@/styles/index.module.css";
import Net from "@/components/Net";
import Card from "@/components/Card";

import { FaEye, FaComments, FaEdit, FaTrash } from "react-icons/fa";

const stripHTML = (html = "") => html.replace(/<[^>]*>/g, "");

export default function Home({
  initialPosts,
  totalPosts,
  totalViews,
}) {
  const router = useRouter();

  const [posts, setPosts] = useState(initialPosts);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length === 10);
  const [search, setSearch] = useState("");

  const filteredPosts = posts.filter((p) =>
    p.head.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    await deleteDoc(doc(db, "posts", id));
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const loadMore = async () => {
    if (!hasMore) return;
    setLoadingMore(true);

    const last = posts[posts.length - 1];

    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      startAfter(last.createdAt),
      limit(10)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      setHasMore(false);
      setLoadingMore(false);
      return;
    }

    const more = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setPosts((prev) => [...prev, ...more]);
    setHasMore(snap.size === 10);
    setLoadingMore(false);
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <div className={styles.container}>
        <Net />
        <Card />

        {/* STATS */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h4>Total Posts</h4>
            <span>{totalPosts}</span>
          </div>
          <div className={styles.statCard}>
            <h4>Total Views</h4>
            <span>{totalViews}</span>
          </div>
        </div>

        {/* SEARCH */}
        <input
          className={styles.search}
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* POSTS */}
        <div className={styles.posts}>
          {filteredPosts.map((post) => (
            <div key={post.id} className={styles.post}>
              {post.imageUrl && (
                <img src={post.imageUrl} className={styles.image} />
              )}

              <h2>{post.head}</h2>
              <p>{stripHTML(post.story).slice(0, 300)}...</p>

              <div className={styles.meta}>
                <span><FaEye /> {post.views || 0}</span>
                <span><FaComments /> {post.totalComments || 0}</span>
              </div>

              <div className={styles.actions}>
                <button onClick={() => router.push(`/Editor?id=${post.id}`)}>
                  <FaEdit /> Edit
                </button>
                <button onClick={() => handleDelete(post.id)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <button
            className={styles.loadMore}
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Reba izindi"}
          </button>
        )}
      </div>
    </>
  );
}

/* 🔐 SERVER SIDE PROTECTION */
export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const username = cookies.username;

  // 🔐 AUTH GATE: NTA COOKIE = redirect
  if (!username) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // 🔹 FETCH POSTS ZOSE (NTA FILTER KU USERNAME)
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(10)
  );

  const snap = await getDocs(q);

  const initialPosts = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  const allSnap = await getDocs(collection(db, "posts"));

  let totalViews = 0;
  allSnap.forEach((d) => (totalViews += d.data().views || 0));

  return {
    props: {
      initialPosts,
      totalPosts: allSnap.size,
      totalViews,
    },
  };
}
