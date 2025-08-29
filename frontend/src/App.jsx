import React from "react";
import ButtonGradient from "./assets/svg/ButtonGradient";
import WebPage from "./pages/WebPage";
import { Routes, Route } from "react-router-dom";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import { useAuthStore } from "./store/useAuthStore";
import CharacterEditorPage from "./pages/CharacterEditorPage";
import StoryEditorPage from "./pages/StoryEditorPage";
import SettingsPage from "./pages/SettingsPage";


const App = () => {

  const { authUser } = useAuthStore();

  return (
    <>
      <div>
     
        <Routes>


        <Route path="/" element={ <WebPage /> } />
        <Route path="/signup" element={ <SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={ <ProfilePage />} />
        <Route path="/home" element={ <HomePage />} />
        <Route path="/settings" element={ <SettingsPage />} />
        <Route path="/characters" element={<CharacterEditorPage />} />
        <Route path="/characters/:id" element={<CharacterEditorPage />} />
        <Route path="/story-editor" element={<StoryEditorPage />} />
        <Route path="/story-editor/:id" element={<StoryEditorPage />} />






        {/* <Route path="/" element={!authUser ? <WebPage /> : <LoginPage />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/home" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/home" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/home" element={authUser ? <HomePage /> : <Navigate to="/login" />} /> */}

        </Routes>
       
      </div>

      <ButtonGradient />
    </>  
  );
};

export default App;
