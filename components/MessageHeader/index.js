import styles from './MessageHeader.module.css';
import Link from "next/link";

function MessageHeader({}){
    return (
        <div className={styles.root}>
            <ul>
                <Link href="/">
                    <li>
                        Főoldal
                    </li>
                </Link>
                <li className={styles.mainTitle}>
                    Üzeneteim
                </li>
                <Link href="/">
                    <li>
                        Kilépés
                    </li>
                </Link>
            </ul>
        </div>
    );
}

export default MessageHeader;