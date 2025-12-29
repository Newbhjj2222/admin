import React from "react";
import { FaArrowUp, FaArrowRight } from "react-icons/fa";
import styles from "./NesValueCard.module.css";

export default function NesValueCard() {
  return (
    <div className={styles.card}>
      {/* Animated shine */}
      <div className={styles.shine}></div>

      {/* Header */}
      <div className={styles.header}>VALUE OF NES POINT</div>

      {/* Values */}
      <div className={styles.values}>
        <div className={styles.valueItem}>
          <FaArrowRight /> Non: 8.34 RWF / 1 Nes
        </div>
        <div className={styles.valueItem}>
          <FaArrowUp /> Moni: 15 RWF / 1 Nes
        </div>
      </div>
    </div>
  );
}
