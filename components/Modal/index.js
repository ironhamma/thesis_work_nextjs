import styles from './Modal.module.css';
import cn from 'clsx';
import { useEffect, useState } from 'react';

function Modal({open, setOpen, children}){

    useEffect(() => {
         document.documentElement.style.overflow = open ? "hidden" : "auto";
    }, [open])

    return (
        <div>
            {open && (
                <div className={styles.overlay}>
                    <div className={styles.root}>
                        <span className={styles.close} onClick={() => setOpen()}>X</span>
                        <div>{children}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Modal;