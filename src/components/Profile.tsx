'use client'

import { useState, useEffect } from 'react';
import { signInWithPopup, signOut, auth, provider } from '../../firebase'; // Importe o auth e provider do seu arquivo firebase.js
import styles from '../styles/components/Profile.module.css';
import { useContext } from 'react';
import { ChallengesContext } from '@/contexts/ChallengesContext';

export function Profile() {
    const { level } = useContext(ChallengesContext);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true); // Para indicar carregamento de dados do usuário
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
          // Verifique se os dados de foto e nome estão disponíveis
          const { displayName, photoURL } = currentUser;
          console.log('Usuário autenticado:', currentUser); // Diagnóstico
          setUser({
            displayName: displayName || 'Usuário sem nome',
            photoURL: photoURL || '/default-profile.png' // Imagem padrão
          });
        } else {
          setUser(null);
        }
        setLoading(false); // Dados carregados
      });
  
      return () => unsubscribe();
    }, []);
  
    const handleLogin = async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const { user } = result;
        console.log('Usuário logado:', user); // Verifique o que é retornado aqui
        setUser({
          displayName: user.displayName || 'Usuário sem nome',
          photoURL: user.photoURL || '/default-profile.png'
        });
      } catch (error) {
        console.error('Erro ao fazer login com Google', error);
      }
    };
  
    const handleLogout = async () => {
      try {
        await signOut(auth);
        setUser(null);
      } catch (error) {
        console.error('Erro ao fazer logout', error);
      }
    };
  
    if (loading) {
      return <div>Carregando...</div>; // Indicador de carregamento
    }

  return (
    <div className={styles.profileContainer}>
      {user ? (
        <>
          <img src={user.photoURL} alt={user.displayName} />
          <div>
            <strong>{user.displayName}</strong>
            <p>
              <img src="icons/level.svg" alt="Level" />
              Level {level}
            </p>
            <button className='mt-3 bg-white p-2 rounded-md' onClick={handleLogout}>Logout</button>
          </div>
        </>
      ) : (
        <button className='bg-white p-2 rounded-md' onClick={handleLogin}>
            Login com Google
        </button>
      )}
    </div>
  );
}
