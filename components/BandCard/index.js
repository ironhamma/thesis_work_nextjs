import React, { useState } from "react";
import styles from "./BandCard.module.css";
import Button from "../Button";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import cn from "clsx";

export default function BandCard({ bandData, currentUser, users, onInvite, onRemove, onDelete, onApprove }) {
  const [edited, setEdited] = useState(false);
  const [isInvited, setIsInvited] = useState(bandData.users.find(e => e.user === currentUser.userName)?.status === 0);
  const userOptions = users
    .filter((e) => !bandData.users.map((x) => x.user).includes(e.userName))
    .map((e) => ({
      label: e.userName,
      value: e._id,
    }));

  const { handleSubmit, errors, reset, control } = useForm({
    defaultValues: {
      invited: "",
    },
  });

  const onSave = (res) => {
    setEdited(false);
    if (res.invited !== "") {
      reset();
      onInvite(res, bandData.bandName);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <div className={styles.bandName}>{bandData.bandName}</div>
      </div>
      <div className={styles.body}>
        {edited && bandData.users.find(e => e.user === currentUser.userName).status === 2 && (
                    <div className={styles.deleteBand} onClick={() => onDelete(bandData.bandName)}>
                        Zenekar törlése
                    </div>
        )} 
        <h2>Tagok</h2>
        <ul>
          {bandData.users.map((e, index) => (
            <li key={index}>
              <div
                className={cn(styles.bandMember, {
                  [styles.memberEdit]: edited,
                  [styles.pending]: e.status === 0,
                  [styles.accepted]: e.status === 1,
                  [styles.owner]: e.status === 2,
                })}
              >
                {e.user}
                {edited && e.status !== 2 && <div className={styles.removeButton} onClick={() => onRemove(bandData.bandName, e.user)}>X</div>}
              </div>
            </li>
          ))}
        </ul>
        {isInvited && (
            <div className={styles.editButton}>
                <div className={styles.invitedBy}>{`Meghívott: ${bandData.users.find(e => e.user === currentUser.userName).invitedBy}`}</div>
                <Button onClick={() => {onApprove(bandData.bandName, currentUser.userName); setIsInvited(false);}} type="approve">Elfogadás</Button>
            </div>
        )}
        {!isInvited && (!edited ? (
          <div className={styles.editButton}>
            <Button onClick={() => setEdited(true)}>Szerkesztés</Button>
          </div>
        ) : (
          <div className={styles.editButton}>
            <Controller
              name="invited"
              control={control}
              as={Select}
              placeholder="Válassz felhasználót"
              options={userOptions}
            />
            <Button onClick={handleSubmit(onSave)} type="approve">Meghívás</Button>
            <Button onClick={() => setEdited(false)} type="danger">Mégse</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
