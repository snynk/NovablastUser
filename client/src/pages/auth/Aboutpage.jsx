import React, { useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa';
import "@/assets/css/aboutpage.css";

function AboutPage() {
  // Refs for animations
  const headerRef = useRef(null);
  const missionRef = useRef(null);
  const teamRef = useRef(null);
  const valuesRef = useRef(null);
  const testimonialsRef = useRef(null);
  const storyRef = useRef(null);
  
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  useEffect(() => {
    // Initial animations for sections
    const elements = [
      { ref: headerRef, delay: 100 },
      { ref: missionRef, delay: 300 },
      { ref: teamRef, delay: 500 },
      { ref: valuesRef, delay: 700 },
      { ref: testimonialsRef, delay: 900 },
      { ref: storyRef, delay: 1100 }
    ];

    elements.forEach(({ ref, delay }) => {
      if (ref.current) {
        setTimeout(() => {
          ref.current.classList.add('animate-in');
        }, delay);
      }
    });

    // Enhanced scroll animation function with smoother reveal
    const handleScroll = () => {
      const scrollElements = document.querySelectorAll('.scroll-reveal');
      
      scrollElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = (elementTop < window.innerHeight * 0.85) && (elementBottom > 0);
        
        // Calculate how far into the viewport the element is
        const distanceFromTop = window.innerHeight - elementTop;
        const percentVisible = Math.min(Math.max(distanceFromTop / (window.innerHeight * 0.3), 0), 1);
        
        if (isVisible) {
          // Apply opacity based on scroll position for a smoother effect
          element.style.opacity = percentVisible;
          element.style.transform = `translateY(${(1 - percentVisible) * 20}px)`;
          
          // Add class when fully visible
          if (percentVisible >= 0.8) {
            element.classList.add('revealed');
          }
        } else if (elementTop > window.innerHeight) {
          // Reset elements that are below viewport
          element.style.opacity = 0;
          element.style.transform = 'translateY(20px)';
          element.classList.remove('revealed');
        }
      });
    };

    // Run once to set initial state
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Header Section */}
      <div className="top-bar">
        <div className="container top-container">
          <div className="promo-text">
            <span className="flag">🚩</span> started as just $99/month.
          </div>
          <div className="top-nav">
            <div className="dropdown">
              <span>Real Estate Education</span>
              <span className="dropdown-arrow">▼</span>
            </div>
            <Link to="/about">About us</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/auth-login">Login</Link>
            <Link to="/auth-mainpage">Home</Link>
          </div>
        </div>
      </div>

      <div className="main-nav">
        <div className="container main-nav-container">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 40 40" width="40" height="40">
                <rect x="5" y="10" width="30" height="20" rx="5" fill="#102f47" />
                <rect x="12" y="15" width="16" height="10" rx="2" fill="#00b977" />
              </svg>
            </div>
            <span className="logo-text">Nova<span className="highlight">Blast</span></span>
          </div>

          <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <div className="dropdown nav-dropdown">
              <span>Why NovaBlast</span>
              <span className="dropdown-arrow">▼</span>
              <div className="dropdown-content">
                <a href="/features">Features</a>
                <a href="/benefits">Benefits</a>
                <a href="/testimonials">Testimonials</a>
              </div>
            </div>

            <div className="dropdown nav-dropdown">
              <span>Solutions</span>
              <span className="dropdown-arrow">▼</span>
              <div className="dropdown-content">
                <a href="/realtors">For Realtors</a>
                <a href="/brokers">For Brokers</a>
                <a href="/agents">For Agents</a>
              </div>
            </div>

            <a href="/pricing" className="nav-link">Pricing</a>

            <div className="dropdown nav-dropdown">
              <span>Resources</span>
              <span className="dropdown-arrow">▼</span>
              <div className="dropdown-content">
                <a href="/blog">Blog</a>
                <a href="/guides">Guides</a>
                <a href="/webinars">Webinars</a>
              </div>
            </div>
          </div>

          <div className="cta-button">
            <button className="get-started-btn">Get Started</button>
          </div>
        </div>
      </div>

      {/* About Hero Section */}
      <div className="about-hero-section7 scroll-reveal">
        <div className="container2 about-hero-container2" ref={headerRef}>
          <h1 className="about-hero-title">About NovaBlast</h1>
          <p className="about-hero-subtitle2">
            Empowering Real Estate Professionals with Cutting-Edge SMS Lead Generation
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="about-story-section">
        <div className="container about-section-container">
          <div className="about-section-content scroll-reveal" ref={storyRef}>
            <h2 className="section-title2">Our Story</h2>
            <div className="about-story-content">
              <div className="about-story-text">
                <p>
                  NovaBlast was born from a simple observation: real estate professionals needed better tools to connect with potential clients. 
                  Founded in 2020 by a team of real estate veterans and tech innovators, we set out to create a platform that would revolutionize 
                  lead generation in the real estate industry.
                </p>
                <p>
                  What started as a small startup with just 5 team members has grown into an industry-leading platform trusted by thousands of 
                  real estate professionals nationwide. Our journey has been defined by constant innovation, unwavering customer focus, and a 
                  deep understanding of the challenges faced by modern real estate professionals.
                </p>
                <p>
                  Today, NovaBlast stands as the premier SMS marketing solution for the real estate industry, combining cutting-edge technology 
                  with industry-specific expertise to deliver unparalleled results for our clients.
                </p>
              </div>
              <div className="about-story-image2 scroll-reveal">
                <img src="images\accelerate.png" alt="NovaBlast story" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="about-mission-section2">
        <div className="container2 about-section-container2">
          <div className="about-section-content scroll-reveal" ref={missionRef}>
            <h2 className="section-title2">Our Mission</h2>
            <div className="mission-statement2">
              <p>
                At NovaBlast, our mission is to empower real estate professionals with the most reliable, effective, and compliant 
                lead generation tools in the industry. We believe that by streamlining communication and enhancing client engagement, 
                we can help our customers build stronger relationships, close more deals, and achieve sustainable business growth.
              </p>
            </div>
            <div className="mission-highlights2">
              <div className="mission-highlight-item2">
                <div className="highlight-icon2">💼</div>
                <h3>Empower Professionals</h3>
                <p>Providing tools that give real estate professionals a competitive edge in their markets</p>
              </div>
              <div className="mission-highlight-item2">
                <div className="highlight-icon2">🚀</div>
                <h3>Drive Growth</h3>
                <p>Helping our clients scale their businesses through effective lead generation and conversion</p>
              </div>
              <div className="mission-highlight-item2">
                <div className="highlight-icon2">🤝</div>
                <h3>Build Relationships</h3>
                <p>Facilitating meaningful connections between real estate professionals and their clients</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="about-values-section2">
        <div className="container about-section-container2">
          <div className="about-section-content scroll-reveal" ref={valuesRef}>
            <h2 className="section-title2">Our Core Values</h2>
            <div className="values-grid2">
              <div className="value-item2">
                <div className="value-icon2">⚡</div>
                <h3>Innovation</h3>
                <p>Constantly pushing the boundaries of what's possible in real estate technology</p>
              </div>
              <div className="value-item2">
                <div className="value-icon2">🔍</div>
                <h3>Transparency</h3>
                <p>Building trust through honest communication and clear metrics</p>
              </div>
              <div className="value-item2">
                <div className="value-icon2">🔄</div>
                <h3>Reliability</h3>
                <p>Delivering consistent, dependable service that our clients can count on</p>
              </div>
              <div className="value-item2">
                <div className="value-icon2">📈</div>
                <h3>Results-Driven</h3>
                <p>Focusing on outcomes that directly impact our clients' success</p>
              </div>
              <div className="value-item2">
                <div className="value-icon2">🛡️</div>
                <h3>Compliance</h3>
                <p>Ensuring all our services meet the highest regulatory standards</p>
              </div>
              <div className="value-item2">
                <div className="value-icon">🌱</div>
                <h3>Growth Mindset</h3>
                <p>Embracing challenges and continuously learning to better serve our clients</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Team Section */}
      <div className="about-team-section2">
        <div className="container2 about-section-container2">
          <div className="about-section-content scroll-reveal" ref={teamRef}>
            <h2 className="section-title2">Our Leadership Team</h2>
            <div className="team-grid2">
              <div className="team-member2">
                <div className="team-member-image2">
                  <img src="images\accelerate.png" alt="Team Member" />
                </div>
                <h3>Chetan Sir</h3>
                <p className="team-title2">CEO & Co-Founder</p>
                <p className="team-bio">Former real estate broker with 15+ years of industry experience and a passion for technology solutions.</p>
              </div>
              <div className="team-member">
                <div className="team-member-image">
                  <img src="images\accelerate.png" alt="Team Member" />
                </div>
                <h3>Chetan Sir</h3>
                <p className="team-title">CTO & Co-Founder</p>
                <p className="team-bio">Tech innovator with extensive experience in developing communication platforms and mobile solutions.</p>
              </div>
              <div className="team-member">
                <div className="team-member-image">
                  <img src="images\accelerate.png" alt="Team Member" />
                </div>
                <h3>Sunil</h3>
                <p className="team-title">Devloper</p>
                <p className="team-bio">Operations expert with a background in scaling technology companies and optimizing customer experience.</p>
              </div>
              <div className="team-member">
                <div className="team-member-image">
                  <img src="images\accelerate.png" alt="Team Member" />
                </div>
                <h3>Vivek</h3>
                <p className="team-title">Devloper</p>
                <p className="team-bio">Product visionary focused on creating intuitive tools that address real industry challenges.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Testimonials */}
      <div className="about-testimonials-section">
        <div className="container about-section-container">
          <div className="about-section-content scroll-reveal" ref={testimonialsRef}>
            <h2 className="section-title">What Our Clients Say</h2>
            <div className="testimonials-grid">
              <div className="testimonial-item">
                <div className="testimonial-quote">"NovaBlast completely transformed my real estate business. The lead generation capabilities are unlike anything I've experienced before."</div>
                <div className="testimonial-author">
                  <img src="images\accelerate.png" alt="Testimonial Author" />
                  <div className="author-info">
                    <h4>Robert James</h4>
                    <p>Real Estate Broker, California</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-item">
                <div className="testimonial-quote">"The reliability of NovaBlast's platform has been a game-changer for our agency. We've seen a 200% increase in qualified leads since implementing their system."</div>
                <div className="testimonial-author">
                  <img src="images\accelerate.png" alt="Testimonial Author" />
                  <div className="author-info">
                    <h4>Amanda Wilson</h4>
                    <p>Team Leader, Premier Properties</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-item">
                <div className="testimonial-quote">"What sets NovaBlast apart is their understanding of the real estate industry. Their platform addresses the specific challenges we face every day."</div>
                <div className="testimonial-author">
                  <img src="images\accelerate.png" alt="Testimonial Author" />
                  <div className="author-info">
                    <h4>Marcus Thompson</h4>
                    <p>Independent Agent, Texas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="about-cta-section">
        <div className="container about-cta-container scroll-reveal">
          <h2>Ready to Transform Your Real Estate Business?</h2>
          <p>Join thousands of successful real estate professionals who trust NovaBlast for their lead generation needs.</p>
          <div className="cta-buttons">
            <Link to="/pricing" className="cta-button primary">View Pricing</Link>
            <Link to="/contact" className="cta-button secondary">Contact Us</Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer scroll-reveal">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Column 1: Company Info and Social */}
            <div className="footer-column company-column">
              <h2 className="footer-title">The phone system for modern business</h2>
              
              {/* Social Media */}
              <div className="social-section">
                <h4 className="social-title">Follow us</h4>
                <div className="social-icons">
                  <a href="#" className="social-icon">
                    <FaFacebookF />
                  </a>
                  <a href="#" className="social-icon">
                    <FaTwitter />
                  </a>
                  <a href="#" className="social-icon">
                    <FaLinkedinIn />
                  </a>
                  <a href="#" className="social-icon">
                    <FaInstagram />
                  </a>
                  <a href="#" className="social-icon">
                    <FaYoutube />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Column 2: Resources */}
            <div className="footer-column">
              <h3 className="column-title">Resources</h3>
              <ul className="footer-links">
                <li><a href="#">Real Estate Lead Generation</a></li>
                <li><a href="#">Support for Real Estate Wholesalers</a></li>
              </ul>
            </div>
            
            {/* Column 3: Solutions */}
            <div className="footer-column">
              <h3 className="column-title">Solutions</h3>
              <ul className="footer-links">
                <li><a href="#">High Deliverability and Response Rates</a></li>
                <li><a href="#">Drip Campaigns</a></li>
              </ul>
            </div>
            
            {/* Column 4: Features */}
            <div className="footer-column">
              <h3 className="column-title">Features</h3>
              <ul className="footer-links">
                <li><a href="#">Value Access for Real Estate Education</a></li>
                <li><a href="#">Disposition and TC Support</a></li>
              </ul>
            </div>
            
            {/* Column 5: Company */}
            <div className="footer-column">
              <h3 className="column-title">Company</h3>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Footer */}
          <div className="footer-bottom">
            <div className="copyright">
              @ Copyright NovaBlast 2025
            </div>
            
            <div className="footer-legal">
              <a href="#">Legal</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Security</a>
              <a href="#">Sitemap</a>
              <a href="#">Cookies Preferences</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default AboutPage;