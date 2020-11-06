import styles from './PageTitle.module.css';

function PageTitle({children}){
    return (
        <h1 className={styles.root}>
            {children}
        </h1>
    );
}

export default PageTitle;