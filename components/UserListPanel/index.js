import styles from './UserListPanel.module.css';
import cn from "clsx";

function UserListPanel({users, onClick, selectedUser}){
    return (
        <div className={styles.root}>
            <ul>
                {users.map((e, index) => (
                    <li key={index} onClick={() => onClick(e.userName)} className={cn({[styles.active]: e.userName === selectedUser})}>
                        <div className={styles.userName}>{e.userName}</div>
                        <div className={styles.msgChunk}>Something here you can see...</div>
                        <div className={styles.lastOnline}>5 napja</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserListPanel;