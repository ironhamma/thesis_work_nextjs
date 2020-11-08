import styles from './Button.module.css';
import cn from 'clsx';

function Button({onClick, type, children, capital, disabled}){
    return (
        <button disabled={disabled} onClick={onClick} className={cn(styles.root, {[styles.disabled]: disabled, [styles.danger]: type === "danger", [styles.approve]: type === "approve", [styles.capitalized]: capital})}>{children}</button>
    );
}

export default Button;