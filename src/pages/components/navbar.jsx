import { useEffect, useState } from 'react';
import searchIcon from './../../assets/search.png'; // Renamed to avoid confusion with search logic
import userIcon from './../../assets/user.png';
import './navbar.responsive.css';

const NavBar = () => {
    const [loginState, setLoginState] = useState(false);

    return (
        <nav className="navbar-dark w-full h-[10vh] flex justify-between items-center px-4 sticky top-0 z-50">
            {/* 1. Logo */}
            <div className="navbar-logo flex items-center">
                <a href="/">ᎮᏂᎧᏁᏦ ᏂᏬᏰ</a>
            </div>

            {/* 2. Search Bar - Styled like the Discover page */}
            <div className="search-bar">
                <input 
                    type="search" 
                    placeholder="Search tracks, artists..." 
                    className="search-input"
                />
            </div>


            {/* 3. Navigation Links */}
            <div className="w-[25%]">
                <ul className="flex justify-around font-medium text-sm text-white">
                    <li><a href='./discover' className='hover:text-black transition-colors'>Discover</a></li>
                    <li><a href='./support' className='hover:text-black transition-colors'>Support</a></li>
                    <li><a href='./aboutus' className='hover:text-black transition-colors'>About Us</a></li>
                </ul>
            </div>

            {/* 4. Auth Actions */}
            <div className="w-[20%] flex justify-end items-center">
                {!loginState ? (
                    <div className="w-full flex justify-end gap-3">
                        <button 
                            className="px-5 py-1.5 text-xs font-bold border-2 border-[#2e3192] text-[#2e3192] rounded-full hover:bg-[#2e3192] hover:text-white transition-all cursor-pointer"
                            onClick={() => setLoginState(true)} // Example toggle
                        >
                            Sign In
                        </button>
                        <button 
                            className="px-5 py-1.5 text-xs font-bold bg-[#2e3192] border-2 border-[#2e3192] text-white rounded-full hover:bg-cyan-700 hover:border-cyan-700 transition-all cursor-pointer"
                        >
                            Sign Up
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <span className="text-xs text-white font-bold hidden md:block group-hover:underline">My Profile</span>
                        <img src={userIcon} alt="user" className='w-9 h-9 rounded-full border-2 border-white shadow-sm'/>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default NavBar;