'use client'

import { useContext, useEffect, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import styles from '../styles/components/Countdown.module.css'
import { ChallengesContext } from '@/contexts/ChallengesContext';

let coutndownTimeout: NodeJS.Timeout;

export function Countdown(){
    const { startNewChallenge } = useContext(ChallengesContext)

    const timeOfExecution = 0.05 * 60 //Para 25 minutos de exercício
    const [time, setTime] = useState(timeOfExecution);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0').split('');
    const [secondLeft, secondRight] = String(seconds).padStart(2, '0').split('');

    function startCountdown(){
        setIsActive(true)
    }
    function resetCountdown(){
        clearTimeout(coutndownTimeout)
        setIsActive(false)
        setTime(timeOfExecution)
    }

    useEffect(() => {
        if(isActive && time > 0){
            coutndownTimeout = setTimeout(() => {
                setTime(time - 1);
            }, 1000)
        } else if (isActive && time === 0){
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();
        }
    }, [isActive, time])

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