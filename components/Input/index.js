import styles from './Input.module.css';
import {memo, forwardRef} from "react";

function Input({placeholder, disabled, value, title, ...props}, ref){
    return (
        <div className={styles.wrapper}>
            {title && <div className={styles.label}><label>{title}</label></div>}
            <input disabled={disabled} placeholder={placeholder} ref={ref} value={value} className={styles.root} {...props} />
        </div>
    );
}

export default memo(forwardRef(Input));