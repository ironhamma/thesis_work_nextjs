import styles from './Button.module.css';
import cn from 'clsx';

function Button({onClick, type, submit, children, capital}){
    return (
        <button onClick={onClick} className={cn(styles.root, {[styles.danger]: type === "danger", [styles.capitalized]: capital})}>{children}</button>
    );
}

export default Button;