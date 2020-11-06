import React from "react";
import styles from "./Spacer.module.css";

export default function Spacer({ x = 0, y = 0 }) {
  return (
    <span
      className={styles.root}
      style={{
        marginTop: y !== 0 ? y * 20 : null,
        marginLeft: x !== 0 ? x * 20 : null,
      }}
    />
  );
}
