import React, { useState } from "react";
import styles from "./BandCard.module.css";
import Button from "../Button";
import Select from "react-select";

export default function BandCard({bandData, users}) {

    const [edited, setEdited] = useState(false);
    const userOptions = users.filter(e => !bandData.users.map(x => x.user).includes(e.userName)).map(e => ({
        label: e.userName, value: e._id
    }));

  return (
    <div
      className={styles.root}
    >
        <div className={styles.head}>
            <div className={styles.bandName}>{bandData.bandName}</div>
        </div>
        <div className={styles.body}>
            <h2>Tagok</h2>
            <ul>
                {bandData.users.map((e,index) => (
                    <li key={index}>{e.user}</li>
                ))}
            </ul>
            {!edited ? (
                <div className={styles.editButton}>
                    <Button onClick={() => setEdited(true)}>Szerkesztés</Button>
                </div>
            ) : (
                <div className={styles.editButton}>
                    <Select isMulti options={userOptions} placeholder="Válassz felhasználót!"/>
                    <Button onClick={() => setEdited(false)}>Meghívás</Button>
                    <Button onClick={() => setEdited(false)}>Mégse</Button>
                </div>
            )}
        </div>
    </div>
  );
}
