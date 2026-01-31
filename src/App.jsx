import { Route, Routes } from 'react-router-dom';
import Navbar from './pages/components/navbar'
import FooterBar from './pages/components/footer.jsx';
import Home from './pages/home/home.jsx';
import Discover from './pages/discover/discover.jsx';
import Profile from './pages/profile/profile.jsx';
import Support from './pages/support/support.jsx';
import Login from './pages/auth/signin.jsx';
import Register from './pages/auth/signup.jsx';

function App() {

  

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/support" element={<Support />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
      <FooterBar />

    </>
  )
}

export default App;
