//raw

import React, { use } from 'react'
import Header from '../components/HomePage/Header'
import Footer from '../components/HomePage/Footer'
import CharacterPage from '../components/HomePage/CharacterPage'
import ChatContainerPage from '../pages/ChatContainerPage'
import { useChatStore } from '../store/useChatStore'



const HomePage = () => {
  const { selectedCharacter } = useChatStore();

  return (
    <>
      {!selectedCharacter ? (
        <div>
          <Header />
          <CharacterPage />
          <Footer />
        </div>
      ) : (
        <ChatContainerPage />
      )}
    </>
  );
}

export default HomePage;






