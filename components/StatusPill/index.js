import React from "react";
import styles from "./StatusPill.module.css";
import {RESERVATION_STATUSES} from "../../util/consts";

export default function StatusPill({status}) {

    const statusObj = RESERVATION_STATUSES.find(e => e.id === status);
  
    const statusStyle = {
        backgroundColor: statusObj.backgroundColor,
        color: statusObj.color,
        border: `2px solid ${statusObj.borderColor}`
    };

    return (
        <span style={statusStyle} className={styles.root}>
            {statusObj.title}
        </span>
    )
}
