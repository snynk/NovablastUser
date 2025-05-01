import { Link } from "react-router-dom";
import "@/assets/css/Mainpage.css";
import React, { useEffect, useRef, useState } from 'react'; 
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube, FaApple, FaGooglePlay, FaChevronUp } from 'react-icons/fa';

// Back to Top Button Component
function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className={`back-to-top-container ${isVisible ? 'visible' : ''}`}>
      <button 
        className="back-to-top-btn"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <FaChevronUp />
      </button>
    </div>
  );
}

function HeroSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs for animations
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const formRef = useRef(null);
  const dashboardRef = useRef(null);
  const trustSectionRef = useRef(null);
  const logosRef = useRef(null);
  const bannerRef = useRef(null);
  
  // Ref for pricing section to scroll to
  const pricingSectionRef = useRef(null);

  useEffect(() => {
    // Initial animations for hero section
    const elements = [
      { ref: titleRef, delay: 100 },
      { ref: subtitleRef, delay: 300 },
      { ref: formRef, delay: 500 },
      { ref: dashboardRef, delay: 700 },
      { ref: trustSectionRef, delay: 900 },
      { ref: logosRef, delay: 1100 },
      { ref: bannerRef, delay: 1300 }
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

  // Function to scroll to pricing section
  const scrollToPricing = () => {
    if (pricingSectionRef.current) {
      pricingSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="top-bar">
      <div className="container top-container">
        <div className="promo-text">
          <span className="flag">🚩</span> started as just $99/month.
        </div>
        <div className="top-nav">
          {/* <div className="dropdown">
            <span>Real Estate Education</span>
          </div> */}
          <Link to="/about" className="arrow-button">About us <span className="arrow-icon"></span></Link>
          <Link to="/contact" className="arrow-button">Contact Us <span className="arrow-icon"></span></Link>
          <Link to="/auth-login" className="arrow-button">Login <span className="arrow-icon"></span></Link>
          {/* <button className="arrow-button">
            Get Started <span className="arrow-icon"></span>
          </button> */}
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
            <span className="logo-text1">Nova<span className="highlight">Blast</span></span>
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
            <button className="get-started-btn" onClick={scrollToPricing}>Get Started</button>
          </div>
        </div>
      </div>

         {/* Hero Section */}
         <div className="hero-section">
        <div className="container hero-container">
          <h1 className="hero-title" ref={titleRef}>
            Generate More Leads & Close More Deals
          </h1>
          <p className="hero-subtitle" ref={subtitleRef}>
            Create Opportunities with Us! Become a Novablast Partner<br />
            and Accelerate Your Real Estate Success.
          </p>

          <div className="demo-form" ref={formRef}>
            <input type="email" placeholder="Work Email" className="email-input" />
            <button className="demo-btn pulse-animation" onClick={scrollToPricing}>Request Demo</button>
          </div>

          {/* Dashboard image with fade-in and slide-up animation */}
          <div className="dashboard-preview" ref={dashboardRef}>
            <img src="/images/Novablast.png" alt="Dashboard Preview" className="dashboard-image" />
          </div>

          {/* Trust section with fade-in animation */}
          <div className="trust-section" ref={trustSectionRef}>
            <p className="trust-text">TRUSTED BY YOUR FAVORITE GROUPS & MANY MORE</p>
          </div>

          {/* Logo grid with staggered fade-in animation */}
          <div className="logo-container">
            <div className="logo-grid" ref={logosRef}>
              {/* First set of logos */}
              <img src="/images/two.png" alt="Partner Logo 2" className="logo-image" />
              <img src="/images/three.png" alt="Partner Logo 3" className="logo-image" />
              <img src="/images/four.png" alt="Partner Logo 4" className="logo-image" />
              <img src="/images/five.png" alt="Partner Logo 5" className="logo-image" />
              <img src="/images/six.png" alt="Partner Logo 6" className="logo-image" />
              
              {/* Duplicate logos for seamless scrolling */}
              <img src="/images/two.png" alt="Partner Logo 2" className="logo-image" />
              <img src="/images/three.png" alt="Partner Logo 3" className="logo-image" />
              <img src="/images/four.png" alt="Partner Logo 4" className="logo-image" />
              <img src="/images/five.png" alt="Partner Logo 5" className="logo-image" />
              <img src="/images/six.png" alt="Partner Logo 6" className="logo-image" />
            </div>
          </div>

          {/* SMS Leader Banner with slide-in animation */}
          <div className="sms-leader-banner scroll-reveal" ref={bannerRef}>
            <h2 className="hero-title1">Leaders in SMS Lead Generation</h2>
            <div className="sms-leader-inner">
              <div className="sms-leader-content">
                <p>
                  Proud to be recognized as a top-rated platform for real estate and marketing professionals. 
                  Novablast empowers real estate professionals and marketers to generate more leads, close more deals, 
                  and scale their businesses with confidence.
                </p>
                <div className="sms-buttons-row">
                  <button className="btn get-started-btn btn-secondary" onClick={scrollToPricing}>Get Started</button>
                  <button className="get-started-btn btn btn-secondary" onClick={scrollToPricing}>Request a Demo</button>
                </div>
              </div>
              <div className="sms-leader-image">
                <img src="/images/midmarket.png" alt="Midmarket" />
              </div>
            </div>
          </div>

          <div className="main-feature-container">
            <div className="smartconvocation scroll-reveal"> 
              <h2>Smarter Conversations, in a few minutes</h2>
              <h3>User-friendly text marketing packed with powerful features.</h3>
            </div>

            <div className="features-grid">
              <div className="feature-item scroll-reveal">
                <img src="/images/setup.png" alt="Feature 1" />
                <p className="feature-title">Set up in seconds</p>
                <p>Goodby guesswork. Hello, better decisions. Monitor metrics in real-time to start making measurable improvements.</p>
              </div>
              <div className="feature-item scroll-reveal">
                <img src="/images/text.png" alt="Feature 2" />
                <p className="feature-title">Text message automation</p>
                <p>Boost productivity and efficiency with drip automated, smarter conversations that enhance your outreach.</p>
              </div>
              <div className="feature-item scroll-reveal">
                <img src="/images/leaverage.png" alt="Feature 3" />
                <p className="feature-title">Leverage insights</p>
                <p>Goodby guesswork. Hello, better decisions. Monitor metrics in real-time to start making measurable improvements.</p>
              </div>
              <div className="feature-item scroll-reveal">
                <img src="/images/accelerate.png" alt="Feature 4" />
                <p className="feature-title">Accelerate your outreach</p>
                <p>Whether you use Novatblast as your primary CRM or integrate it with others using our one-click Push to CRM feature, experience advanced CRM capabilities and seamless integration.</p>
              </div>
              <div className="feature-item scroll-reveal">
                <img src="/images/text.png" alt="Feature 2" />
                <p className="feature-title">Text message automation</p>
                <p>Boost productivity and efficiency with drip automated, smarter conversations that enhance your outreach.</p>
              </div>
              <div className="feature-item scroll-reveal">
                <img src="/images/leaverage.png" alt="Feature 3" />
                <p className="feature-title">Leverage insights</p>
                <p>Goodby guesswork. Hello, better decisions. Monitor metrics in real-time to start making measurable improvements.</p>
              </div>
            </div>
          </div>

          {/* --------------------reliability downtime------------ */}
          <div className="reliability-container main-feature-container">
            <div className="smartconvocation scroll-reveal"> 
              <h2>Novablast Reliability with No Downtime</h2>
            </div>
            <div className="reliability-item scroll-reveal">
              <img src="/images/Reliability-1.png" alt="Enterprise Grade Infrastructure" />
              <p>Enterprise Grade Infrastructure</p>
              <p>We ensure you never miss a lead with Novablast's unparalleled reliability. Experience zero downtime and maintain a steady flow of leads without interruption.</p>
              
              <button className="more-button" onClick={scrollToPricing}>Learn More</button>

              <h2>Regine Langhorn</h2>
              <p>Lead Generation Manager @ Encore Real Estate</p>
              <p>We switched from another text marketing platform to Novablast. Unreliability and downtime were a huge concern for us. Since we switched to Novablast, not once have we experienced any downtime and the deliverability is amazing.</p>
            </div>

            <div className="reliability-item scroll-reveal">
              <img src="/images/Reliability-2.png" alt="Uptime with Zero Lag" />
              <p>Uptime with Zero Lag</p>
              <p>Stay compliant effortlessly with our built-in features designed to meet all regulatory requirements. Focus on your business while we ensure your campaigns are always in line with the latest regulations.</p>
              
              <button className="more-button" onClick={scrollToPricing}>Learn More</button>

              <h2>Jay Bustamante</h2>
              <p>Real Estate Investor @ Smart REI</p>
              <p>Compliance was a huge concern for us, but with the built-in features, we now manage our campaigns confidently and without any legal worries.</p>
            </div>
          </div>

          <div className="full-screen-box scroll-reveal">
            <img src="/images/accelerate.png" alt="Enterprise Grade Infrastructure" className="screenshot-image" />
            
            <div className="text-content">
              <h1 className="heading hero-title1">True Accurate Deliverability</h1>
              <p className="description">
                Achieve the highest deliverability rates in the industry with our service. 
                Your messages will reach the right audience, maximizing your lead generation efforts.
              </p>
              <button className="learn-more-btn" onClick={scrollToPricing}>Learn More</button>

              <div className="testimonial-box">
                <p className="testimonial-name">Nicole Lalabam<br />Operation Manager @ Yuna Homes</p>
                <p className="testimonial-text">
                  The deliverability of our messages has been phenomenal. We've seen a significant increase in responses and engagement.
                </p>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------------------------------- */}
          {/* Pricing Section - Target for scrolling */}
          <div className="four-plan-section main-feature-container scroll-reveal" ref={pricingSectionRef}>
            <h2 className="four-plan-heading" id="pheading">Four Plans Loaded with Opportunities</h2>

            <div className="pricing-container">
              {/* Plan 1 */}
              <div className="plan-card dark scroll-reveal">
                <h3 className="plan-title">I'm Serious</h3>
                <p className="plan-desc white">Commit to success with our 'I'm Serious' Plan, packed with advanced tools and dedicated support for real estate professionals ready to get started.</p>
                <div className="plan-price">$95<span className="per-month">/month</span></div>
                {/* <a className="subscribe-btn green">Subscribe</a> */}
                <a href="auth-login" className="subscribe-btn green">Subscribe</a>

                <ul className="plan-features">
                  <li className="plan-desc1">Send up to 15,000 Initial Outbound Messages</li>
                  <li className="plan-desc1">Unlimited drip campaigns</li>
                  <li className="plan-desc1">Free unlimited inbound & outbound active conversations</li>
                  <li className="plan-desc1">Guaranteed Highest Delivery & Response</li>
                </ul>
                <a href="about" className="learn-more-link blue">Learn More →</a>
              </div>

              {/* Plan 2 */}
              <div className="plan-card dark scroll-reveal">
                <div className="plans-header">
                  <h3 className="plan-title blue">Time to Scale</h3>
                  <span className="most-popular">most popular</span>
                </div>
                <p className="plan-desc white">Expand your outreach with the 'Time to Scale' Plan, designed to help ambitious professionals grow their real estate business and dominate their market.</p>
                <div className="plan-price">$195<span className="per-month">/month</span></div>
                <a href="auth-login" className="subscribe-btn blue">Subscribe</a>
                <ul className="plan-features">
                  <li className="plan-desc1">Send up to 30,000 initial outbound messages</li>
                  <li className="plan-desc1">3 licensed account users (agents)</li>
                  <li className="plan-desc1">Advanced area code monitoring for highest deliverability</li>
                  <li className="plan-desc1">Built-in 10DLC compliance feature</li>
                </ul>
                <a href="about" className="learn-more-link blue">Learn More →</a>
              </div>

              {/* Plan 3 */}
              <div className="plan-card dark scroll-reveal">
                <h3 className="plan-title">Market Dominator</h3>
                <p className="plan-desc white">Ready to dominate the market? The 'Market Dominator' Plan is designed for top-tier professionals with a full-scale operation, offering wide resources.</p>
                <div className="plan-price white">$595<span className="per-month">/month</span></div>
                <a href="auth-login" className="subscribe-btn green">Subscribe</a>
                <ul className="plan-features white">
                  <li className="plan-desc1">Send up to 65,000 initial outbound messages</li>
                  <li className="plan-desc1">Dedicated account manager</li>
                  <li className="plan-desc1">Customized strategy sessions and personalized support</li>
                  <li className="plan-desc1">Built-in 10DLC compliance feature</li>
                </ul>
                <a href="about" className="learn-more-link blue">Learn More →</a>
              </div>
            </div>
          </div>

          <section className="pricing-section scroll-reveal">
            <div className="pricing-container">
              <div className="pricing-left">
                <h2 className="section-title">Unlock Powerful Lead Generation Tools and Exclusive Education to Skyrocket Your Success</h2>
                
                <div className="price-box">
                  <div className="price">$95</div>
                  <div className="period">/month</div>
                </div>
                
                <h3 className="value-proposition">Don't Just Generate Leads — Close More Deals and Dominate the Market</h3>
                
                <p className="description1">
                  Get the tools, the education, and the support you need to succeed in real estate. With Jumpstart JV + Vault Access, you're not just getting a lead generation platform, you're getting a complete system to build your business, sharpen your skills, and close more deals.
                </p>
                
                <div className="cta-buttons">
                  <a href="auth-login" className="btn get-started-btn btn-secondary">Get Started</a>
                  <a href="about" className="btn get-started-btn btn-secondary">Learn More</a>
                </div>
              </div>
              
              <div className="pricing-right">
                <h2 className="included-title">What's Included</h2>
                
                <div className="feature-item1">
                  <div className="feature-check">✓</div>
                  <div className="feature-text">5K Free Skip-Traced List</div>
                </div>
                
                <div className="feature-item1">
                  <div className="feature-check">✓</div>
                  <div className="feature-text">Vault Access — Your Path to Real Estate Mastery</div>
                </div>
                
                <ol className="education-list">
                  <li>
                    <div className="list-title">Unlimited Education</div>
                    <ul>
                      <li className="list-title1">Novation Agreements</li>
                      <li className="list-title1">Subject-To Deals</li>
                      <li className="list-title1">Traditional Wholesaling</li>
                      <li className="list-title1">Sales Mastery</li>
                    </ul>
                    <div className="list-title">Weekly Q&A Sessions</div>
                    <div className="list-title">Essential Contracts Library</div>
                  </li>
                </ol>
                
                <div className="feature-item1">
                  <div className="feature-check">✓</div>
                  <div className="feature-text">Disposition Support and Transaction Coordination (TC)</div>
                </div>
                
                <ol className="support-list">
                  <li className="list-title1">Expert Disposition Support</li>
                  <li className="list-title1">Transaction Coordination</li>
                </ol>
              </div>
            </div>
          </section>

          <section className="four-plan-section main-feature-container">
            <div className="cta-section scroll-reveal">
              <div className="logo-white">
                <div className="zeit-logo">
                  <div className="speech-bubble"></div>
                  <span className="logo-text">NovaBlast</span>
                </div>
              </div>
              <h1 className="cta-heading">Not sure what plan is best for you?</h1>
              <p className="cta-subtitle">See how our system can work for your business</p>
              <button className="get-started-btn" onClick={scrollToPricing}>Request a Demo</button>
            </div>
          </section>

          <section className="faq-section main-feature-container">
            <h2 className="section-title1 scroll-reveal">Frequently Asked Questions</h2>
            <div className="faq-container">
              <div className="faq-column">
                <div className="faq-item scroll-reveal">
                  <div className="faq-question">
                    <h3>What is the deliverability rate of your text messages?</h3>
                    <button className="toggle-btn">
                      <span className="chevron-down"></span>
                    </button>
                  </div>
                  <div className="faq-answer">
                  </div>
                </div>

                <div className="faq-item scroll-reveal">
                  <div className="faq-question">
                    <h3>How many messages can I send per month?</h3>
                    <button className="toggle-btn">
                      <span className="chevron-down"></span>
                    </button>
                  </div>
                  <div className="faq-answer">
                  </div>
                </div>

                <div className="faq-item scroll-reveal">
                  <div className="faq-question">
                    <h3>Is there a contract or can I cancel at any time?</h3>
                    <button className="toggle-btn">
                      <span className="chevron-down"></span>
                    </button>
                  </div>
                  <div className="faq-answer">
                  </div>
                </div>

                <div className="faq-item scroll-reveal">
                  <div className="faq-question">
                    <h3>How secure is my data?</h3>
                    <button className="toggle-btn">
                      <span className="chevron-down"></span>
                    </button>
                  </div>
                  <div className="faq-answer">
                  </div>
                </div>
              </div>

              <div className="faq-column">
                <div className="faq-item scroll-reveal">
                  <div className="faq-question">
                    <h3>What software do call centers use?</h3>
                    <button className="toggle-btn">
                      <span className="chevron-down"></span>
                    </button>
                  </div>
                  <div className="faq-answer">
                  </div>
                </div>

                <div className="faq-item scroll-reveal">
                  <div className="faq-question">
                    <h3>Can I integrate this platform with my existing CRM?</h3>
                    <button className="toggle-btn">
                      <span className="chevron-down"></span>
                    </button>
                  </div>
                  <div className="faq-answer">
                  </div>
                </div>

                <div className="faq-item scroll-reveal">
                  <div className="faq-question">
                    <h3>How quickly can I start generating leads after signing up?</h3>
                    <button className="toggle-btn">
                      <span className="chevron-down"></span>
                    </button>
                  </div>
                  <div className="faq-answer">
                  </div>
                </div>

                <div className="faq-item scroll-reveal">
                  <div className="faq-question">
                    <h3>Can I track the performance of my campaigns?</h3>
                    <button className="toggle-btn">
                      <span className="chevron-down"></span>
                    </button>
                  </div>
                  <div className="faq-answer">
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      
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

      {/* Back to Top Button */}
      <BackToTopButton />
    </>
  );
}

export default HeroSection;