import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AudioProvider } from './context/AudioContext';
import Navbar from './pages/components/navbar';
import FooterBar from './pages/components/footer.jsx';
import AudioPlayer from './pages/components/AudioPlayer.jsx';
import UploadModal from './pages/components/UploadModal.jsx';
import AuthModal from './pages/components/AuthModal.jsx';

import Home from './pages/home/home.jsx';
import Discover from './pages/discover/discover.jsx';
import Profile from './pages/profile/profile.jsx';
import Support from './pages/support/support.jsx';
import Login from './pages/auth/signin.jsx';
import Register from './pages/auth/signup.jsx';

function App() {
  return (
    <AudioProvider>
      <div className="min-h-screen bg-[#090a10] text-slate-100 flex flex-col font-['Outfit',sans-serif] selection:bg-[#ff0055] selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/support" element={<Support />} />
            <Route path="/aboutus" element={<Support />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <FooterBar />
        <AudioPlayer />
        <UploadModal />
        <AuthModal />
      </div>
    </AudioProvider>
  );
}

export default App;
