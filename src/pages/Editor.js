'use client';
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/components/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FaBold, FaItalic, FaUnderline, FaHeading, FaListUl, FaLink, FaImage, FaSave, FaTrash, FaArrowLeft } from "react-icons/fa";

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const editorRef = useRef(null);

  const [head, setHead] = useState("");
  const [story, setStory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId) return;
    const fetchPost = async () => {
      try {
        const ref = doc(db, "posts", postId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setHead(data.head || "");
          setStory(data.story || "");
          setImageUrl(data.imageUrl || "");
          if (editorRef.current) editorRef.current.innerHTML = data.story || "";
        } else {
          alert("Inkuru ntiboneka.");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [postId, router]);

  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  const insertImage = () => {
    const url = prompt("Shyiramo URL y'ifoto:");
    if (!url) return;
    document.execCommand("insertImage", false, url);
  };

  const savePost = async () => {
    if (!head.trim()) return alert("Shyiramo umutwe w'inkuru!");
    if (!editorRef.current) return;

    const content = editorRef.current.innerHTML;
    setLoading(true);
    try {
      const ref = doc(db, "posts", postId);
      await updateDoc(ref, {
        head,
        story: content,
        imageUrl,
        updatedAt: new Date(),
      });
      setStory(content);
      setLoading(false);
      alert("Inkuru ivuguruwe neza ✅");
    } catch (error) {
      setLoading(false);
      console.error("Error saving post:", error);
      alert("Byanze gukomeza kubika inkuru.");
    }
  };

  const deletePost = async () => {
    if (!confirm("Ushaka koko gusiba iyi nkuru?")) return;
    try {
      await updateDoc(doc(db, "posts", postId), { deleted: true });
      alert("Inkuru yasibwe 🚫");
      router.push("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Byanze gusiba inkuru.");
    }
  };

  const handleInput = (e) => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    setStory(editorRef.current.innerHTML);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  return (
    <>
      
      <div className="editorContainer">
        {/* Toolbar */}
        <div className="toolbar">
          <button onClick={() => router.back()} title="Subira inyuma"><FaArrowLeft /></button>
          <button onClick={() => formatText("bold")} title="Bold"><FaBold /></button>
          <button onClick={() => formatText("italic")} title="Italic"><FaItalic /></button>
          <button onClick={() => formatText("underline")} title="Underline"><FaUnderline /></button>
          <button onClick={() => formatText("insertUnorderedList")} title="List"><FaListUl /></button>
          <button onClick={() => formatText("createLink")} title="Link"><FaLink /></button>
          <button onClick={() => formatText("formatBlock", "<h2>")} title="Heading"><FaHeading /></button>
          <button onClick={insertImage} title="Insert Image"><FaImage /></button>
          <button onClick={savePost} disabled={loading} title="Save"><FaSave /> {loading ? "Irabika..." : "Bika"}</button>
          <button onClick={deletePost} className="delete" title="Delete"><FaTrash /></button>
        </div>

        {imageUrl && <img src={imageUrl} alt={head} className="postImage" />}

        <input
          className="titleInput"
          placeholder="Andika umutwe w’inkuru (head)..."
          value={head}
          onChange={(e) => setHead(e.target.value)}
        />

        <div
          className="editorArea"
          contentEditable
          suppressContentEditableWarning
          ref={editorRef}
          onInput={handleInput}
        ></div>
      </div>

      {/* =========================
          CSS INLINE FOR THEME SUPPORT
      ========================= */}
      <style jsx>{`
        .editorContainer {
          max-width: 900px;
          margin: 40px auto;
          margin-top: 120px;
          padding: 20px;
          background: var(--bg-card);
          color: var(--foreground);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .toolbar {
          display: flex;
          margin-top: 50px;
          flex-wrap: wrap;
          gap: 8px;
          background: var(--bg-card);
          padding: 8px;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
        }

        .toolbar button {
          background: var(--primary);
          color: var(--text-light);
          border: none;
          border-radius: var(--radius-sm);
          padding: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s;
        }
        .toolbar button:hover { transform: translateY(-2px); }
        .toolbar .delete { background: var(--danger); }

        .postImage {
          width: 100%;
          max-height: 200px;
          object-fit: cover;
          border-radius: var(--radius-md);
        }

        .titleInput {
          padding: 10px;
          font-size: var(--text-lg);
          font-family: var(--font-sans);
          border-radius: var(--radius-sm);
          border: 1px solid var(--gray-300);
          background: var(--bg-card);
          color: var(--foreground);
          outline: none;
        }

        .titleInput::placeholder { color: var(--text-muted); }

        .editorArea {
          max-height: 400px;
          padding: 12px;
          font-family: var(--font-sans);
          font-size: var(--text-base);
          background: var(--bg-card);
          color: var(--foreground);
          border-radius: var(--radius-sm);
          border: 1px solid var(--gray-300);
          outline: none;
          overflow-y: auto;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .editorContainer { padding: 16px; margin: 20px; }
          .toolbar button { padding: 6px; font-size: 0.9rem; }
          .titleInput { font-size: var(--text-base); }
        }
      `}</style>
    </>
  );
}
