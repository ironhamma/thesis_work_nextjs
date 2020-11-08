import styles from './UserListPanel.module.css';
import Link from "next/link";
import cn from 'clsx';

function UserListPanel({users}){
    return (
        <div className={styles.root}>
            <ul>
                {users.map((e, index) => (
                    <Link href={`/messages/t/${e.userName.replace(" ", "_")}`} key={index}>
                        <li>
                            <div className={styles.userName}>{e.userName}</div>
                            <div className={styles.msgChunk}>Something here you can see...</div>
                            <div className={styles.lastOnline}>5 napja</div>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
}

export default UserListPanel;