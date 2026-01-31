import { useState } from 'react';
import './home.css';
import { BsPlayFill, BsHeartFill, BsHeart } from 'react-icons/bs';
import { IoMdTime } from 'react-icons/io';
import { FaFire } from 'react-icons/fa';

const Home = () => {
  const basePath = '/assets/phonkimg/';

  const imagesFromDB = [
    { id: 1, name: 'phonk1.jpg', description: 'Dark Phonk Vibes', plays: '2.5M', duration: '3:45' },
    { id: 2, name: 'phonk1.jpg', description: 'Night Rider', plays: '1.8M', duration: '4:20' },
    { id: 3, name: 'phonk1.jpg', description: 'Street Beats', plays: '3.2M', duration: '3:15' },
    { id: 4, name: 'phonk1.jpg', description: 'Midnight Drive', plays: '1.5M', duration: '3:50' },
    { id: 5, name: 'phonk1.jpg', description: 'Bass Boosted', plays: '2.1M', duration: '4:05' },
    { id: 6, name: 'phonk1.jpg', description: 'Drift Phonk', plays: '4.0M', duration: '3:30' },
  ];

  const [likedItems, setLikedItems] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);

  const toggleLike = (id, e) => {
    e.stopPropagation();
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handlePlayClick = (id, e) => {
    e.stopPropagation();
    console.log('Playing:', id);
    // Add your play logic here
  };

  const handleCardClick = (id) => {
    console.log('Card clicked:', id);
    // Add your navigation logic here
  };

  return (
    <div className="home-wrapper">
      <div className="home-container">
        {/* Header Section */}
        <div className="home-header">
          <div className="header-content">
            <FaFire className="fire-icon" />
            <h1 className='trend-tag'>Trending Phonks</h1>
            <FaFire className="fire-icon" />
          </div>
          <p className="header-subtitle">Discover the hottest phonk tracks right now</p>
        </div>

        {/* Image Grid */}
        <div className="image-container">
          {imagesFromDB.map((img) => (
            <div 
              key={img.id} 
              className="image-card"
              onMouseEnter={() => setHoveredCard(img.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleCardClick(img.id)}
            >

              {/* Image */}
              <img src={`${basePath}${img.name}`} alt={img.description} />
              
              {/* Gradient Overlay */}
              <div className="image-overlay"></div>

              {/* Play Button Overlay */}
              <div className={`play-overlay ${hoveredCard === img.id ? 'active' : ''}`}>
                <button 
                  className="play-button"
                  onClick={(e) => handlePlayClick(img.id, e)}
                  aria-label="Play track"
                >
                  <BsPlayFill />
                </button>
              </div>

              {/* Content Overlay */}
              <div className="card-content">
                {/* Top Info */}
                <div className="card-info-top">
                  <span className="plays-count">
                    <BsPlayFill className="play-icon-small" />
                    {img.plays}
                  </span>
                  <button 
                    className={`like-button ${likedItems.has(img.id) ? 'liked' : ''}`}
                    onClick={(e) => toggleLike(img.id, e)}
                    aria-label="Like track"
                  >
                    {likedItems.has(img.id) ? <BsHeartFill /> : <BsHeart />}
                  </button>
                </div>

                {/* Bottom Info */}
                <div className="card-info-bottom">
                  <h3 className="image-label">{img.description}</h3>
                  <div className="duration">
                    <IoMdTime />
                    <span>{img.duration}</span>
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="card-border"></div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="load-more-section">
          <button className="load-more-btn">
            <span>Load More Tracks</span>
            <div className="btn-glow"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;