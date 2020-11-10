import styles from './Modal.module.css';
import cn from 'clsx';
import { useEffect, useState } from 'react';

function Modal({open, setOpen}){

    useEffect(() => {
         document.documentElement.style.overflow = open ? "hidden" : "auto";
    }, [open])

    return (
        <div>
            {open && (
                <div className={styles.root} onClick={() => setOpen()}>
                    <div>Hello</div>
                </div>
            )}
        </div>
    );
}

export default Modal;