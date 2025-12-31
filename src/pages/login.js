"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/components/firebase";
import { doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";


const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (email !== "newtalents403@gmail.com") {
      setMessage("Email ntiyemewe!");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const docRef = doc(db, "userdate", "data");
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setMessage("Nta document ibonetse muri Firestore.");
        return;
      }

      const data = docSnap.data();
      let found = false;

      for (const key in data) {
        if (data[key].email === email) {
          Cookies.set("username", data[key].fName || "Admin", {
            expires: 7,
          });
          found = true;
          break;
        }
      }

      if (!found) {
        setMessage("Email ntiyabonywe muri Firestore.");
        return;
      }

      setMessage("Winjiye neza ✅");
      router.push("/");
    } catch (error) {
      setMessage("Injira ntibishobotse ❌");
    }
  };

  return (
    <>
      

      <div className="loginWrapper">
        <div className="container">
          <h2 className="loginTitle">Sign In</h2>

          <form onSubmit={handleLogin}>
            {message && <div className="message">{message}</div>}

            <div className="inputGroup">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="inputGroup">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn">
              Sign In
            </button>
          </form>

          <p className="registerLink">
            Niba nta konti ya author ufite twandikire WhatsApp kuri{" "}
            <strong>+250722319367</strong>
          </p>
        </div>
      </div>

      {/* =========================
          CSS (DARK / LIGHT + RESPONSIVE)
      ========================== */}
      <style jsx>{`
        .loginWrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: var(--background);
        }

        .container {
          width: 100%;
          max-width: 420px;
          padding: 32px 24px;
          background: var(--bg-card);
          color: var(--foreground);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
        }

        .loginTitle {
          text-align: center;
          margin-bottom: 24px;
          font-size: var(--text-2xl);
          font-family: var(--font-display);
          color: var(--primary);
        }

        .message {
          margin-bottom: 16px;
          padding: 12px;
          border-radius: var(--radius-sm);
          background: var(--bg-muted);
          color: var(--foreground);
          text-align: center;
          font-size: var(--text-sm);
        }

        .inputGroup {
          margin-bottom: 16px;
        }

        .inputGroup input {
          width: 100%;
          padding: 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--gray-300);
          background: var(--background);
          color: var(--foreground);
          font-size: var(--text-base);
        }

        .inputGroup input::placeholder {
          color: var(--text-muted);
        }

        .inputGroup input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
        }

        .btn {
          width: 100%;
          padding: 12px;
          margin-top: 8px;
          background: var(--primary);
          color: var(--text-light);
          border: none;
          border-radius: var(--radius-md);
          font-size: var(--text-base);
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .btn:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
        }

        .btn:active {
          transform: translateY(0);
        }

        .registerLink {
          margin-top: 20px;
          font-size: var(--text-sm);
          text-align: center;
          color: var(--text-muted);
        }

        .registerLink strong {
          color: var(--primary);
        }

        /* ---------- MOBILE ---------- */
        @media (max-width: 480px) {
          .container {
            padding: 24px 16px;
          }

          .loginTitle {
            font-size: var(--text-xl);
          }
        }
      `}</style>
    </>
  );
};

export default Login;
