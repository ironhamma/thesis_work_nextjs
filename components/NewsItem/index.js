import styles from './NewsItem.module.css';
import cn from 'clsx';
import Button from '../Button';

function NewsItem({onDelete, isAdmin, newsElement, index}){
    return (
        <div className={styles.root} key={index}>
            <h2>
                {newsElement.heading}
            </h2>
            {
                isAdmin &&
                <div className={styles.buttonWrapper}>
                    <Button onClick={(e) => onDelete(e, newsElement._id)} capital>Delete</Button>
                </div>
            }
            <p className={styles.text}>{newsElement.text}</p>
            <p className={styles.date}>{newsElement.created_at}</p>
        </div>
    );
}

export default NewsItem;