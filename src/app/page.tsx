import { GetServerSideProps } from "next";

import { ExperienceBar } from "@/components/ExperienceBar";
import { Profile } from "@/components/Profile";
import { CompletedChallenges } from "@/components/CompletedChallenges";
import { Countdown } from "@/components/Countdown";
import { ChallengeBox } from "@/components/ChallengeBox";
import { Header } from "@/components/Header";

import { CountdownProvider } from "@/contexts/CountdownContext";

import styles from '../styles/pages/Home.module.css'
import { ChallengesProvider } from "@/contexts/ChallengesContext";


export default function Home() {
  return (
    <ChallengesProvider>
      <div className={styles.container}>
        <Header />
        <ExperienceBar />

        <CountdownProvider>
          <section>
            <div>
              <Profile />
              <CompletedChallenges />
              <Countdown />
            </div>
            <div>
              <ChallengeBox />
            </div>
          </section>
        </CountdownProvider>
      </div>
    </ChallengesProvider>
  )
}
/*
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { level, currentExperience, challengesCompleted } = ctx.req.cookies;
  return {
    props: {
      level: Number(level),
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted),
    }
  }
}
*/