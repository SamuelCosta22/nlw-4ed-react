'use client'

import { createContext, ReactNode, useEffect, useState } from 'react';
import challenges from '../../challenges.json';
import { LevelUpModal } from '@/components/LevelUpModal';

interface ChallengesProviderProps {
    children: ReactNode;
}

interface Challenge {
    type: string;
    description: string;
    amount: number;
}

interface ChallengesContextData {
    level: number;
    currentExperience: number;
    experienceToNextLevel: number;
    challengesCompleted: number;
    activeChallenge: Challenge | null;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
    closeLevelUpModal: () => void;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children }: ChallengesProviderProps) {
    const [level, setLevel] = useState<number | null>(null);
    const [currentExperience, setCurrentExperience] = useState<number | null>(null);
    const [challengesCompleted, setChallengesCompleted] = useState<number | null>(null);
    const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    const experienceToNextLevel = level !== null ? Math.pow((level + 1) * 4, 2) : 0;

    useEffect(() => {
        Notification.requestPermission();
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedLevel = Number(localStorage.getItem('level'));
            const storedExperience = Number(localStorage.getItem('currentExperience'));
            const storedChallenges = Number(localStorage.getItem('challengesCompleted'));

            // Inicializando os estados somente após verificar os valores do localStorage
            setLevel(storedLevel || 1);
            setCurrentExperience(storedExperience || 0);
            setChallengesCompleted(storedChallenges || 0);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && level !== null && currentExperience !== null && challengesCompleted !== null) {
            localStorage.setItem('level', level.toString());
            localStorage.setItem('currentExperience', currentExperience.toString());
            localStorage.setItem('challengesCompleted', challengesCompleted.toString());
        }
    }, [level, currentExperience, challengesCompleted]);

    function levelUp() {
        if (level !== null) {
            setLevel(level + 1);
            setIsLevelUpModalOpen(true);
        }
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];
        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();

        if (Notification.permission === 'granted') {
            new Notification('Novo Desafio! 🎉🎉', {
                body: `Desafio valendo ${challenge.amount}xp!`,
            });
        }
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completeChallenge() {
        if (!activeChallenge || currentExperience === null || level === null) {
            return;
        }

        const { amount } = activeChallenge;
        let finalExperience = currentExperience + amount;

        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted! + 1);
    }

    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false);
    }

    if (level === null || currentExperience === null || challengesCompleted === null) {
        return null; // Ou um spinner de carregamento
    }

    return (
        <ChallengesContext.Provider
            value={{
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
            {isLevelUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    );
}