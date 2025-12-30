'use client';

import React, { useState } from "react";
import Net from "@/components/Net";
import { db } from "@/components/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { FaCamera, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

/* ----------------- USERNAME SANITIZER ----------------- */
const sanitizeUsername = (value = "") => {
  try {
    let name = decodeURIComponent(value);
    name = name.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, " ").trim();
    return name;
  } catch {
    return value.replace(/[^a-zA-Z0-9\s]/g, "").trim();
  }
};

export default function Profile({ username, userData, layID, status }) {
  const router = useRouter();
  const [photo, setPhoto] = useState(userData?.photo || "");
  const [email] = useState(userData?.email || "");
  const [feedback, setFeedback] = useState("");

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 3000);
  };

  /* ----------------- IMAGE UPLOAD ----------------- */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setPhoto(base64);

      try {
        const userRef = doc(db, "userdate", "data");
        await updateDoc(userRef, {
          [`${layID}.photo`]: base64,
        });
        showFeedback("Profile photo updated successfully!");
      } catch (err) {
        console.error(err);
        showFeedback("Error updating photo!");
      }
    };
    reader.readAsDataURL(file);
  };

  /* ----------------- LOGOUT ----------------- */
  const handleLogout = () => {
    Cookies.remove("username");
    router.push("/login");
  };

  return (
    <>
      <Net />

      <div className="container">
        <div className="profileCard">
          <div className="profilePicContainer">
            {photo ? (
              <img src={photo} alt="Profile" className="profilePic" />
            ) : (
              <FaUserCircle className="defaultIcon" />
            )}

            <label htmlFor="fileInput" className="cameraIcon">
              <FaCamera />
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <h2 className="username">{username}</h2>

          <div className="infoSection">
            <label>Email:</label>
            <p>{email || "Not set"}</p>
          </div>

          <div className="infoSection">
            <label>Monetization Status:</label>
            <p className="status">{status}</p>
          </div>

          {feedback && (
            <div
              className={
                feedback.toLowerCase().includes("error")
                  ? "errorFeedback"
                  : "feedback"
              }
            >
              {feedback}
            </div>
          )}

          <button onClick={handleLogout} className="logoutBtn">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* ================== CSS YUZUYE ================== */}
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          padding: 40px 16px;
          background: var(--background);
          color: var(--foreground);
          min-height: 100vh;
        }

        .profileCard {
          background: var(--bg-card);
          color: var(--foreground);
          padding: var(--space-lg);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          max-width: 400px;
          width: 100%;
          text-align: center;
        }

        .profilePicContainer {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto var(--space-md);
        }

        .profilePic {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .defaultIcon {
          width: 100%;
          height: 100%;
          color: var(--gray-400);
        }

        .cameraIcon {
          position: absolute;
          bottom: 0;
          right: 0;
          background: var(--primary);
          color: var(--text-light);
          border-radius: 50%;
          padding: 8px;
          cursor: pointer;
        }

        input[type="file"] {
          display: none;
        }

        .username {
          font-size: var(--text-xl);
          font-family: var(--font-display);
          margin-bottom: var(--space-md);
        }

        .infoSection {
          text-align: left;
          margin-bottom: var(--space-sm);
        }

        .infoSection label {
          font-weight: 600;
          display: block;
          margin-bottom: 4px;
        }

        .infoSection p {
          margin: 0;
        }

        .status {
          font-weight: bold;
        }

        .feedback {
          background: var(--success);
          color: var(--text-light);
          padding: var(--space-sm);
          margin-top: var(--space-sm);
          border-radius: var(--radius-sm);
        }

        .errorFeedback {
          background: var(--danger);
          color: var(--text-light);
          padding: var(--space-sm);
          margin-top: var(--space-sm);
          border-radius: var(--radius-sm);
        }

        .logoutBtn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--primary);
          color: var(--text-light);
          border: none;
          padding: var(--space-md);
          border-radius: var(--radius-md);
          cursor: pointer;
          width: 100%;
          margin-top: var(--space-md);
          transition: all 0.3s ease;
        }

        .logoutBtn:hover {
          background: var(--primary-dark);
        }

        @media (max-width: 480px) {
          .profileCard {
            padding: var(--space-md);
          }

          .profilePicContainer {
            width: 100px;
            height: 100px;
          }

          .username {
            font-size: var(--text-lg);
          }

          .logoutBtn {
            padding: var(--space-sm);
          }
        }

        @media (min-width: 481px) and (max-width: 768px) {
          .profileCard {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}

/* ================== SERVER SIDE ================== */
export async function getServerSideProps(context) {
  const cookie = context.req.headers.cookie || "";
  const match = cookie.match(/username=([^;]+)/);

  if (!match) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  const rawUsername = match[1];
  const username = sanitizeUsername(rawUsername);

  const userRef = doc(db, "userdate", "data");
  const userSnap = await getDoc(userRef);

  let userData = null;
  let layID = null;

  if (userSnap.exists()) {
    const data = userSnap.data();
    for (const key in data) {
      if (sanitizeUsername(data[key].fName) === username) {
        layID = key;
        userData = data[key];
        break;
      }
    }
  }

  if (!userData) {
    const defaultLayID = `lay_${Date.now()}`;
    const defaultData = { fName: username, email: "", photo: "" };
    try {
      await updateDoc(userRef, { [defaultLayID]: defaultData });
    } catch {
      await setDoc(userRef, { [defaultLayID]: defaultData }, { merge: true });
    }
    layID = defaultLayID;
    userData = defaultData;
  }

  const authorRef = doc(db, "authors", username);
  const authorSnap = await getDoc(authorRef);
  const status = authorSnap.exists() ? authorSnap.data().status : "Pending";

  return {
    props: { username, userData, layID, status },
  };
}
