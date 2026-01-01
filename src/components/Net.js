'use client';

import React, { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi"; // menu icons
import styles from "./Net.module.css";

const Net = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">NetBoard</Link>
      </div>

      <div className={styles.menuIcon} onClick={toggleMenu}>
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </div>

      <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/Users">User management</Link></li>
           <li><Link href="/Anslyser">Stories Checking</Link></li>
          <li><Link href="/Bible">Send Bible verse</Link></li>
          <li><Link href="/Manager">Web management</Link></li>
           <li><Link href="/Push">Sell web</Link></li>
           <li><Link href="/Nes">Depositers</Link></li>
           <li><Link href="/Show">Tv show</Link></li>
          <li><Link href="/Team">Authors Management</Link></li>
          <li><Link href="/addTeam">Add Author</Link></li>
          <li><Link href="/Request">Monetization Requests</Link></li>
          <li><Link href="/monitize">Monitization management</Link></li>
          <li><Link href="/rewards">Authors Balances</Link></li>
          <li><Link href="/store">Store of Stories</Link></li>
         <li><Link href="/folder">Folder management</Link></li>
          <li><Link href="/verse">Bible verse manager</Link></li>
          <li><Link href="/withdrawal">Withdrawal requests</Link></li>
          <li><Link href="/Profile">Profile</Link></li>
          <li><Link href="https://dash-nine-rho.vercel.app/manage">News manager</Link></li>
          <li><Link href="https://dash-nine-rho.vercel.app/addnew">Publish news</Link></li>
          <li><Link href="https://dash-nine-rho.vercel.app/poly">Poly maker</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Net;
