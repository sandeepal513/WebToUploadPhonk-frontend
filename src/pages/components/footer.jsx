import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';
import { BiWorld } from 'react-icons/bi';
import './footer.responsive.css';

const FooterBar = () => {

    return (
        <footer className="footer-dark">
            <div className="footer-container">
                {/* About Section */}
                <div className="about-card">
                    <h1 className='footer-logo'>
                        ᎮᏂᎧᏁᏦ ᏂᏬᏰ
                    </h1>
                    <div className='footer-description'>
                        Phonk Hub is a community-driven platform for phonk lovers.
                        Discover, upload, and share phonk tracks inspired by raw beats, underground culture, and dark aesthetics.
                        Built for artists, listeners, and anyone who lives the phonk vibe.
                    </div>
                    <div className='social-icons'>
                        <a href="https://facebook.com" aria-label="Facebook" className="social-link">
                            <FaFacebook />
                        </a>
                        <a href="https://twitter.com" aria-label="Twitter X" className="social-link">
                            <BsTwitterX />
                        </a>
                        <a href="https://instagram.com" aria-label="Instagram" className="social-link">
                            <FaInstagram />
                        </a>
                    </div>
                </div>

                {/* Site Map Section */}
                <div className="site-map-card">
                    <h1 className='footer-section-title'>
                        Site Map
                    </h1>
                    <ul className='footer-links'>
                        <li><a href="/discover">Discover</a></li>
                        <li><a href="/support">Support</a></li>
                        <li><a href="/aboutus">About us</a></li>
                        <li><a href="/profile">Profile</a></li>
                    </ul>
                </div>
                
                {/* Language Selection Section */}
                <div className="lang-card">
                    <div className="lang-selector">
                        <BiWorld className="lang-icon" />
                        <select
                            className="lang-select"
                            defaultValue="en"
                        >
                            <option value="en">English</option>
                            <option value="si">සිංහල</option>
                            <option value="ta">தமிழ்</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {/* Copyright / Bottom Bar */}
            <div className="footer-bottom">
                © {new Date().getFullYear()} Phonk Hub. All rights reserved.
            </div>
        </footer>
    );
}

export default FooterBar;