import styles from './TextArea.module.css';
import {memo, forwardRef} from "react";

function TextArea({placeholder, disabled, value, title, ...props}, ref){
    return (
        <div className={styles.wrapper}>
            {title && <div className={styles.label}><label>{title}</label></div>}
            <textarea disabled={disabled} placeholder={placeholder} ref={ref} value={value} className={styles.root} {...props} />
        </div>
    );
}

export default memo(forwardRef(TextArea));