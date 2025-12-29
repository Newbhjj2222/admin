'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/components/firebase";
import { doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import styles from "@/components/Login.module.css";
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
        setMessage("Nta document 'data' ibonetse muri Firestore.");
      }
    } catch (error) {
      setMessage("Injira ntibishobotse: " + error.message);
    }
  };

  return (
    <>
      <Net />
      <div className={styles.container}>
        <h2 className={styles.loginTitle}>Sign In</h2>
        <form onSubmit={handleLogin}>
          {message && <div className={styles.messageDiv}>{message}</div>}

          <div className={styles.inputGroup}>
            <i className={styles.inputIcon + " fas fa-envelope"}></i>
            <input
              type="email"
              placeholder="Email"
              required
              className={styles.inputField}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <i className={styles.inputIcon + " fas fa-lock"}></i>
            <input
              type="password"
              placeholder="Password"
              required
              className={styles.inputField}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.btn}>
            Sign In
          </button>
        </form>

        <p className={styles.registerLink}>
          Niba nta konti ya author ufite twandikire WhatsApp kuri{" "}
          <strong>+250722319367</strong> tugufashe.
        </p>
      </div>
    </>
  );
};

export default Login;
