import styles from './FancyList.module.css';
import format from "date-fns/format";
import Button from "../Button";
import StatusPill from "../StatusPill";
import cn from 'clsx';

function FancyList({ordered, listData, theme, onAccept, onDecline, onLetIn, onCancel, cancelable, userType, vanilla}){
    return (
        <div className={cn(styles.root, {[styles.darkTheme] : theme === "dark"})}>
            <ul>
               {
                   listData.map((e, index) => (
                        <li key={index}>
                            {ordered && <span className={styles.listItemNumber}>{index + 1}</span>}
                            <div className={styles.listDataSection}>
                                <span className={styles.listSubtitle}>Foglalta:</span>
                                <span className={styles.listData}>{e.reservedBy}</span>
                            </div>
                            <div className={styles.listDataSection}>
                                <span className={styles.listSubtitle}>Zenekar:</span>
                                <span className={styles.listData}>{e.bandName}</span>
                            </div>
                            <div className={styles.listDataSection}>
                                <span className={styles.listSubtitle}>Időpont:</span>
                                <span className={styles.listData}>{`${format(new Date(e.reserveStartDate), "yyyy. MMM. dd. HH:mm")} – ${format(new Date(e.reserveEndDate), "HH:mm")}`}</span>
                            </div>
                            <div className={styles.listDataSection}>
                                <span className={styles.listSubtitle}>Státusz:</span>
                                <StatusPill status={e.status} />
                            </div>
                            <div className={styles.listDataSection}>
                                <span className={styles.listSubtitle}>Beengedő:</span>
                                <span className={styles.listData}>{e.assignee === null ? "Nincs" : e.assignee}</span>
                            </div>
                            {!vanilla && (!cancelable ? (
                            <>
                                <div className={styles.listButton}>
                                {e.assignee === null && (
                                        <Button disabled={e.status === 3} onClick={() => onLetIn(e._id)}>Beengedem</Button>
                                        )}
                                </div>
                                <div className={styles.listButton}>
                                    <Button type="approve" disabled={e.status === 2} onClick={() => onAccept(e._id)}>Elfogadás</Button>
                                </div>
                                {
                                    (userType === 1 || userType === 2) && (
                                    <div className={styles.listButton}>
                                        <Button type="danger" disabled={e.status === 3} onClick={() => onDecline(e._id)}>Elutasítás</Button>
                                    </div>
                                    )
                                }
                            </>
                            )
                            :
                            (
                            <>
                                <div className={styles.listButton}>
                                    <Button onClick={() => onCancel(e._id)}>Leadás</Button>
                                </div>
                            </>
                            ))}
                        </li>
                   ))
               } 
            </ul>
        </div>
    );
}

export default FancyList;