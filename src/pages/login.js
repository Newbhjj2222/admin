'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/components/firebase";
import { doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import Net from "@/components/Net";

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "userdate", "data");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        let found = false;

        for (const key in data) {
          const userData = data[key];
          if (userData.email === email) {
            const fName = userData.fName || "Unknown";
            Cookies.set("username", fName, { expires: 7 });
            found = true;
            break;
          }
        }

        if (found) {
          setMessage("Winjiye neza!");
          router.push("/");
        } else {
          setMessage("Email ntiyabonywe muri Firestore.");
        }
      } else {
        setMessage("Nta document ibonetse muri Firestore.");
      }
    } catch (error) {
      setMessage("Injira ntibishobotse: " + error.message);
    }
  };

  return (
    <>
      <Net />

      <div className="container">
        <h2 className="loginTitle">Sign In</h2>

        <form onSubmit={handleLogin}>
          {message && <div className="messageDiv">{message}</div>}

          <div className="inputGroup">
            <i className="inputIcon fas fa-envelope"></i>
            <input
              type="email"
              placeholder="Email"
              required
              className="inputField"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="inputGroup">
            <i className="inputIcon fas fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              required
              className="inputField"
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

      {/* ===== CSS IMBERE MURI FILE ===== */}
      <style jsx>{`
        .container {
          max-width: 400px;
          margin: 60px auto;
          padding: 32px 24px;
          background: var(--background);
          color: var(--foreground);
          border-radius: var(--radius-lg);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          transition: all 0.3s ease-in-out;
        }

        .loginTitle {
          text-align: center;
          margin-bottom: 32px;
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--primary);
        }

        .messageDiv {
          background: var(--danger-light);
          color: var(--danger);
          padding: 12px;
          border-radius: var(--radius-sm);
          margin-bottom: 16px;
          text-align: center;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .inputGroup {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          border: 1px solid var(--gray-300);
          border-radius: var(--radius-sm);
          padding: 10px;
          background: var(--bg-light);
          transition: border 0.3s, box-shadow 0.3s;
        }

        .inputGroup:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
        }

        .inputIcon {
          color: var(--gray-500);
          font-size: 1.1rem;
          transition: color 0.3s;
        }

        .inputGroup:focus-within .inputIcon {
          color: var(--primary);
        }

        .inputField {
          border: none;
          outline: none;
          flex: 1;
          padding: 10px;
          font-size: 1rem;
          background: transparent;
          color: var(--foreground);
        }

        .btn {
          width: 100%;
          padding: 14px;
          background: var(--primary);
          color: #fff;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          margin-top: 12px;
          transition: background 0.3s, transform 0.2s;
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
          font-size: 0.95rem;
          text-align: center;
          color: var(--text-muted);
        }

        .registerLink strong {
          color: var(--primary);
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .container {
            margin: 40px 16px;
            padding: 28px 16px;
          }

          .loginTitle {
            font-size: 1.5rem;
            margin-bottom: 24px;
          }

          .btn {
            padding: 12px;
            font-size: 0.95rem;
          }

          .inputField {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </>
  );
};

export default Login;
