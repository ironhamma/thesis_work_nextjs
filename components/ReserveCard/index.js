import styles from './ReserveCard.module.css';
import cn from 'clsx';
import { useEffect, useState } from 'react';
import StatusPill from '../StatusPill';
import Button from '../Button';

function ReserveCard({event, setModalOpen}){

    return (
        <div className={styles.root} >
            <div className={styles.title}>{event.title}</div>
            <div className={styles.status}>
                <StatusPill status={event.status}/>
            </div>
            <div className={styles.start}>{event.start.toString()}</div>
            <div className={styles.end}>{event.end.toString()}</div>
            <div className={styles.buttons}>
                <Button>Módosítás</Button>
                <Button type="danger" onClick={setModalOpen}>Törlés</Button>
            </div>               
        </div>
    );
}

export default ReserveCard;