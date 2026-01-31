import { useRef, useState, useEffect } from 'react';
import './discover.css';
import { BiStar } from "react-icons/bi";
import { IoFilter, IoClose } from "react-icons/io5";
import { MdMood } from 'react-icons/md';
import { FcRating } from 'react-icons/fc';
import { BsSearch } from 'react-icons/bs';
import { AiOutlineCheck } from 'react-icons/ai';

const moods = ["Dark", "Chill", "Aggressive", "Sad", "Hype"];

// Sample data - replace with your actual data
const sampleContent = [
    { id: 1, title: "Dark Vibes", mood: "Dark", rating: 4, image: "https://via.placeholder.com/200" },
    { id: 2, title: "Chill Beats", mood: "Chill", rating: 5, image: "https://via.placeholder.com/200" },
    { id: 3, title: "Aggressive Energy", mood: "Aggressive", rating: 3, image: "https://via.placeholder.com/200" },
    { id: 4, title: "Sad Melodies", mood: "Sad", rating: 4, image: "https://via.placeholder.com/200" },
    { id: 5, title: "Hype Party", mood: "Hype", rating: 5, image: "https://via.placeholder.com/200" },
    { id: 6, title: "Dark Night", mood: "Dark", rating: 5, image: "https://via.placeholder.com/200" },
    { id: 7, title: "Chill Sunset", mood: "Chill", rating: 4, image: "https://via.placeholder.com/200" },
    { id: 8, title: "Aggressive Rock", mood: "Aggressive", rating: 5, image: "https://via.placeholder.com/200" },
];

const Discover = () => {
    const [isExpand, setIsExpand] = useState(true);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const hideFilterBar = useRef(null);
    const [rating, setRating] = useState(0);
    const [activeMood, setActiveMood] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredContent, setFilteredContent] = useState(sampleContent);
    const [hoverRating, setHoverRating] = useState(0);

    // Handle filter toggle for desktop
    const handleFilterToggle = () => {
        if (window.innerWidth > 768) {
            setIsExpand(!isExpand);
        }
    };

    // Handle mobile filter toggle
    const handleMobileFilterToggle = () => {
        setIsMobileFilterOpen(!isMobileFilterOpen);
    };

    // Reset all filters
    const handleReset = () => {
        setActiveMood(null);
        setRating(0);
        setSearchQuery('');
        setFilteredContent(sampleContent);
    };

    // Apply filters
    const handleShowResults = () => {
        let filtered = [...sampleContent];

        // Filter by mood
        if (activeMood) {
            filtered = filtered.filter(item => item.mood === activeMood);
        }

        // Filter by rating
        if (rating > 0) {
            filtered = filtered.filter(item => item.rating >= rating);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.mood.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredContent(filtered);
        
        // Close mobile filter after applying
        if (window.innerWidth <= 768) {
            setIsMobileFilterOpen(false);
        }
    };

    // Auto-apply filters on change
    useEffect(() => {
        handleShowResults();
    }, [activeMood, rating, searchQuery]);

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsExpand(true);
                setIsMobileFilterOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="discover-container">
            {/* Mobile Filter Toggle Button */}
            <button 
                className="mobile-filter-toggle"
                onClick={handleMobileFilterToggle}
                aria-label="Toggle filters"
            >
                <IoFilter size={24} />
                <span>Filters</span>
                {(activeMood || rating > 0) && <span className="filter-badge"></span>}
            </button>

            {/* Overlay for mobile */}
            {isMobileFilterOpen && (
                <div 
                    className="mobile-overlay"
                    onClick={handleMobileFilterToggle}
                ></div>
            )}

            <div className="main-bar">
                {/* Filter Sidebar */}
                <div 
                    className={`filter-bar ${isMobileFilterOpen ? 'mobile-open' : ''} ${!isExpand ? 'collapsed' : ''}`}
                    ref={hideFilterBar}
                >
                    <div className="filter-bar-top">
                        {isExpand && (
                            <h1 className="filter-title">
                                Filters
                            </h1>
                        )}
                        <div className="filter-controls">
                            <IoFilter 
                                className="filter-icon desktop-toggle" 
                                onClick={handleFilterToggle}
                                aria-label={isExpand ? "Collapse filters" : "Expand filters"}
                                title={isExpand ? "Collapse" : "Expand"}
                            />
                            <IoClose 
                                className="filter-icon mobile-close" 
                                onClick={handleMobileFilterToggle}
                                aria-label="Close filters"
                            />
                        </div>
                    </div>

                    <div className="filter-bar-body">
                        {/* Search Section */}
                        {isExpand && (
                            <div className="filter-section search-section">
                                <div className="section-header">
                                    <BsSearch className="section-icon text-blue-400" />
                                    <h2>Search</h2>
                                </div>
                                <div className="search-input-wrapper">
                                    <BsSearch className="search-icon-input" />
                                    <input
                                        type="text"
                                        placeholder="Search content..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="search-input"
                                    />
                                    {searchQuery && (
                                        <IoClose 
                                            className="clear-search"
                                            onClick={() => setSearchQuery('')}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Mood Section */}
                        <div className="filter-section mood-section">
                            <div className="section-header">
                                {isExpand && <h2>Mood</h2>}
                                <MdMood className="section-icon text-yellow-500" />
                            </div>
                            {isExpand && (
                                <div className="mood-list">
                                    {moods.map((mood) => (
                                        <li
                                            key={mood}
                                            className={`mood-item ${activeMood === mood ? "active" : ""}`}
                                            onClick={() => setActiveMood(activeMood === mood ? null : mood)}
                                        >
                                            {activeMood === mood && <AiOutlineCheck className="check-icon" />}
                                            {mood}
                                        </li>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Rating Section */}
                        <div className="filter-section rating-section">
                            <div className="section-header">
                                {isExpand && <h2>Minimum Rating</h2>}
                                <FcRating className="section-icon" />
                            </div>
                            {isExpand && (
                                <div className="rating-container">
                                    <div className="stars-wrapper">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <BiStar
                                                key={star}
                                                size={28}
                                                className={`star ${
                                                    star <= (hoverRating || rating)
                                                        ? "star-active"
                                                        : "star-inactive"
                                                }`}
                                                onClick={() => setRating(rating === star ? 0 : star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                aria-label={`Rate ${star} stars`}
                                            />
                                        ))}
                                    </div>
                                    {rating > 0 && (
                                        <p className="rating-text">
                                            {rating} star{rating !== 1 ? 's' : ''} & above
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Active Filters Display */}
                        {isExpand && (activeMood || rating > 0 || searchQuery) && (
                            <div className="active-filters">
                                <h3>Active Filters:</h3>
                                <div className="filter-tags">
                                    {activeMood && (
                                        <span className="filter-tag">
                                            {activeMood}
                                            <IoClose onClick={() => setActiveMood(null)} />
                                        </span>
                                    )}
                                    {rating > 0 && (
                                        <span className="filter-tag">
                                            {rating}+ stars
                                            <IoClose onClick={() => setRating(0)} />
                                        </span>
                                    )}
                                    {searchQuery && (
                                        <span className="filter-tag">
                                            "{searchQuery}"
                                            <IoClose onClick={() => setSearchQuery('')} />
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Filter Buttons */}
                        {isExpand && (
                            <div className="filter-buttons">
                                <button 
                                    className='reset-filter-btn'
                                    onClick={handleReset}
                                    disabled={!activeMood && rating === 0 && !searchQuery}
                                >
                                    Reset
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="content-area">
                    <div className="content-header">
                        <h1 className="content-title">Discover</h1>
                        <p className="content-subtitle">
                            {filteredContent.length} result{filteredContent.length !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    <div className="content-grid">
                        {filteredContent.length > 0 ? (
                            filteredContent.map((item) => (
                                <div key={item.id} className="content-card">
                                    <div className="card-image-wrapper">
                                        <img src={item.image} alt={item.title} />
                                        <div className="card-overlay">
                                            <span className="mood-badge">{item.mood}</span>
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="card-title">{item.title}</h3>
                                        <div className="card-rating">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <BiStar
                                                    key={star}
                                                    size={16}
                                                    className={star <= item.rating ? "text-yellow-400" : "text-gray-600"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results">
                                <div className="no-results-icon">😕</div>
                                <h2>No results found</h2>
                                <p>Try adjusting your filters or search query</p>
                                <button 
                                    className="reset-btn-main"
                                    onClick={handleReset}
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Discover;