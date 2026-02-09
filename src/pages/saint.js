import Head from "next/head";
import {
  FaHeart,
  FaRegHeart,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import { GiRose, GiLovers } from "react-icons/gi";
import { BsHeartFill } from "react-icons/bs";
import styles from "../styles/Saint.module.css";

export default function Saint() {
  return (
    <>
      <Head>
        <title>My lovely queen CLEMANTINE</title>
      </Head>

      <div className={styles.container}>
        {/* BACKGROUND FLOATING HEARTS */}
        <div className={styles.heartsBg}>
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className={styles.bgHeart}>
              ❤
            </span>
          ))}
        </div>

        <div className={styles.card}>
          <h1 className={styles.title}>
            <GiLovers className={styles.iconMain} />
            Hello mukunzi <FaHeart className={styles.heart} />
          </h1>

          <p>
            <FaEnvelopeOpenText className={styles.icon} />
            Ese waruziko kuva wakwinjira mu buzima bwanjye ibintu byose byahindutse?
            Urukundo rwawe rwanyigishije kwihangana, kwishima, no gukunda byukuri.
          </p>

          <p>
            <GiRose className={styles.icon} />
            Sinyitekereza uko nabaho udahari, ahubwo girira amatsiko ukunzaba igihe
            uzaba warabaye uwanjye <FaRegHeart className={styles.inlineHeart} />.
          </p>

          <p>
            <BsHeartFill className={styles.icon} />
            Iteka iyo ntekereje ahazaza, izina ryawe niryo rinzamo kenshi.
            Ndagushimira kuba waranziye mu buzima.
          </p>

          <p>
            <GiRose className={styles.icon} />
            Uko uteye, ukuvuga, uko utekereza, uko useka byose byakuriye ubuzima
            bwanjye, bituma iteka nifuza guhora nkuhobeye 💕
          </p>

          <p>
            <GiLovers className={styles.icon} />
            Saint Valentin ya mbere dukundana, nsengera ko tuzizihiza n’iya 2080
            turi kumwe <FaHeart className={styles.inlineHeart} />.
          </p>

          <h2 className={styles.signature}>
            Ndagukunda cyane <FaHeart /> <BsHeartFill /> <FaRegHeart />
          </h2>
        </div>
      </div>
    </>
  );
}
