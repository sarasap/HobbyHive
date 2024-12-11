import {React, useEffect} from 'react';
// eslint-disable-next-line no-unused-vars
import Slider from 'react-slick';
import './LandingPage.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {

    useEffect(() => {
        document.title = 'HobbyHive';
      }, []);
    
      // eslint-disable-next-line no-unused-vars
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };
    const handleSignupClick = () => {
        navigate('/signup');
    };

    

    return (
        <div className="landing-page">
            <header className="header">
                <nav className="navbar">
                    <div className="logo">
                        HOBBYHIVE
                    </div>
                    <ul className="nav-links">
                        <li><span onClick={handleLoginClick} className="nav-link">Login</span></li>
                        <li><span onClick={handleSignupClick} className="signup-button">Sign Up</span></li>
                    </ul>
                </nav>
            </header>

            <section className="hero-section">
                <div className="hero-overlay">
                    <div className="hero-text">
                        <h1>Discover, Share, and Connect with Create Hobbies</h1>
                        <p>Join a community of passionate hobbyists and explore the latest viral content from your favorite hobbies!</p>
                        <span onClick={handleSignupClick} className="cta-button">Get Started</span>
                    </div>
                    <div className="hero-image">
                        <img src="/hero-image.png" alt="Hero" />
                    </div>
                </div>
            </section>

            <section className="viral-content">
                <h2>Trending Now</h2>
                <div className="viral-grid">
                    <div className="viral-card">
                        <img src="/photography.png" alt="Photography" />
                        <h3>Photography</h3>
                        <p>Explore the latest tips and stunning photography shots shared by professionals.</p>
                    </div>
                    <div className="viral-card">
                        <img src="/painting.png" alt="Painting" />
                        <h3>Painting</h3>
                        <p>Get inspired by trending art pieces and tutorials on mastering your craft.</p>
                    </div>
                    <div className="viral-card">
                        <img src="/gaming.png" alt="Gaming" />
                        <h3>Gaming</h3>
                        <p>Join the latest discussions and tips for the most popular games right now.</p>
                    </div>
                </div>
            </section>

            <div className="fab" onClick={() => alert('Floating Action Button Clicked!')}>
                +
            </div>

            <section className="testimonials">
                <h2>What Users Say</h2>
                <div className="testimonial-grid">
                    <div className="testimonial-card">
                        <p>"HobbyHive is amazing! I've connected with so many people who share my passion for photography."</p>
                        <h4>- Venissa, Photographer</h4>
                    </div>
                    <div className="testimonial-card">
                        <p>"A great place to organize painting meetups and share tips. Highly recommend!"</p>
                        <h4>- Dong Lee, Painter</h4>
                    </div>
                    <div className="testimonial-card">
                        <p>"It's like a home for gamers like me. Love the events and groups."</p>
                        <h4>- Alex Green, Gamer</h4>
                    </div>
                </div>
            </section>

            <section className="achievements">
                <h2>Top Contributors</h2>
                <div className="achievement-grid">
                    <div className="achievement-card">
                        <img src="/achiever.png" alt="Top Contributor Badge" />
                        <p>John Wick - 120 Posts</p>
                    </div>
                    <div className="achievement-card">
                        <img src="/eventorganizer.png" alt="Event Organizer Badge" />
                        <p>Sarah Cooper - 5 Events Organized</p>
                    </div>
                </div>
            </section>

            <section className="polls">
                <h2>Vote Now</h2>
                <div className="poll">
                    <h3>Which hobby should we highlight next?</h3>
                    <form>
                        <input type="radio" name="hobby" value="Photography" /> Photography <br />
                        <input type="radio" name="hobby" value="Painting" /> Painting <br />
                        <input type="radio" name="hobby" value="Gaming" /> Gaming <br />
                        <button type="submit">Vote</button>
                    </form>
                </div>
            </section>






            <footer className="footer">
                <p>&copy; 2024 HobbyHive. All rights reserved.</p>
                <div className="footer-links">
                    <span onClick={() => navigate('/about')}>About</span>
                    <span onClick={() => navigate('/contact')}>Contact</span>
                    <span onClick={() => navigate('/privacy')}>Privacy Policy</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
