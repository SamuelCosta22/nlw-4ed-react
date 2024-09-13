'use client'

import { createContext, ReactNode, useEffect, useState } from 'react';
import challenges from '../../challenges.json';
import { LevelUpModal } from '@/components/LevelUpModal';

interface ChallengesProviderProps{
    children: ReactNode,
}

interface Challenge{
    type: string;
    description: string;
    amount: number;
}

interface ChallengesContextData{
    level: number;
    currentExperience: number;
    experienceToNextLevel: number;
    challengesCompleted: number;
    activeChallenge: Challenge | null;
    levelUp: () => void,
    startNewChallenge: () => void,
    resetChallenge: () => void,
    completeChallenge: () => void,
    closeLevelUpModal: () => void,
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children }: ChallengesProviderProps){
    // Recuperar dados do Local Storage no lado do cliente
    const storedLevel = Number(localStorage.getItem('level'));
    const storedExperience = Number(localStorage.getItem('currentExperience'));
    const storedChallenges = Number(localStorage.getItem('challengesCompleted'));

    const [level, setLevel] = useState(storedLevel ?? 1);
    const [currentExperience, setCurrentExperience] = useState(storedExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(storedChallenges ?? 0);
    const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null); // Tipo atualizado
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

    useEffect(() => {
        Notification.requestPermission()
    }, []) 

    function levelUp(){
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    }

    function startNewChallenge(){
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];
        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();

        if(Notification.permission === 'granted'){
            new Notification('Novo Desafio! 🎉🎉', {
                body: `Desafio valendo ${challenge.amount}xp!`
            })
        }
    }

    function resetChallenge(){
        setActiveChallenge(null);
    }

    function completeChallenge(){
        if(!activeChallenge){
            return;
        }

        const { amount } = activeChallenge;
        let finalExperience = currentExperience + amount;

        if(finalExperience >= experienceToNextLevel){
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    function closeLevelUpModal(){
        setIsLevelUpModalOpen(false)
    }

    useEffect(() => {
        localStorage.setItem('level', level.toString())
        localStorage.setItem('currentExperience', currentExperience.toString())
        localStorage.setItem('challengesCompleted', challengesCompleted.toString())
    }, [level, currentExperience, challengesCompleted])

    return(
        <ChallengesContext.Provider value={{
                level, 
                currentExperience, 
                experienceToNextLevel,
                challengesCompleted, 
                levelUp,
                startNewChallenge,
                activeChallenge,
                resetChallenge,
                completeChallenge,
                closeLevelUpModal,
            }}
        >
            {children}
            { isLevelUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    )
}