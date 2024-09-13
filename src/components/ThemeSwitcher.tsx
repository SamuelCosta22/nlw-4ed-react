'use client'

import { useState, useEffect } from 'react';
import styles from '../styles/components/Themeswitcher.module.css'

export function ThemeSwitcher(){
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if(isDarkMode){
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return(
        <div>
            <label className={styles.switch}>
                <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
                <span className={styles.slider}></span>
            </label>
        </div>
    )
}
