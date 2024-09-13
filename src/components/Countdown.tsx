'use client'

import { useContext } from 'react'
import { ShieldCheck } from 'lucide-react'
import styles from '../styles/components/Countdown.module.css'
import { CountdownContext } from '@/contexts/CountdownContext';

export function Countdown(){
    const {
        minutes,
        seconds,
        hasFinished,
        isActive,
        startCountdown,
        resetCountdown,
    } = useContext(CountdownContext)

    const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0').split('');
    const [secondLeft, secondRight] = String(seconds).padStart(2, '0').split('');

    return(
        <div>
            <div className={styles.countdownContainer}>
                <div>
                    <span>{minuteLeft}</span>
                    <span>{minuteRight}</span>
                </div>
                <span>:</span>
                <div>
                    <span>{secondLeft}</span>
                    <span>{secondRight}</span>
                </div>
            </div>

            { hasFinished ? (
                <button disabled className={styles.countdownButton}>
                    <div className='flex flex-col flex-1 items-center h-[70%] mt-7 rounded-[5px ] justify-between'>
                        <div className='flex items-center gap-4'>
                            Ciclo Encerrado
                            <ShieldCheck fill='#4CD62B' />
                        </div>
                        <div className='h-1 bg-[#4CD62B] w-full'></div>
                    </div>
                </button>
            ) : (
                <>
                    { isActive ? (
                        <button type='button' className={`${styles.countdownButton} ${styles.countdownButtonActive}`} onClick={resetCountdown}>
                            Abandonar Ciclo
                        </button>
                    ) : (
                        <button type='button' className={styles.countdownButton} onClick={startCountdown}>
                            Iniciar um ciclo
                        </button>
                    )}   
                </>
            )}         
        </div>
    )
}