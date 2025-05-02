import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaLocationDot, FaPhone, FaEnvelope, FaClock, FaArrowUp,FaChevronUp } from 'react-icons/fa6';
import "@/assets/css/aboutpage.css";

function ContactPage() {
  // Refs for animations
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const faqRef = useRef(null);
  
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State for back to top button visibility
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // State for form validation
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[^\d]/g, ''))) {
      errors.phone = 'Phone number is invalid';
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      // Form is valid, simulate submission
      setFormSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset form submitted state after 3 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
    } else {
      // Form has errors
      setFormErrors(errors);
    }
  };
  
  // Handle scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // Initial animations for sections
    const elements = [
      { ref: headerRef, delay: 100 },
      { ref: formRef, delay: 300 },
      { ref: infoRef, delay: 500 },
      { ref: faqRef, delay: 700 }
    ];

    elements.forEach(({ ref, delay }) => {
      if (ref.current) {
        setTimeout(() => {
          ref.current.classList.add('animate-in');
        }, delay);
      }
    });

    // Enhanced scroll animation function with smoother reveal and fade effects
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
            
            // Add fade-in effect to child elements with staggered timing
            const cards = element.querySelectorAll('.card-fade');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('card-revealed');
              }, index * 150); // Stagger the animations
            });
          }
        } else if (elementTop > window.innerHeight) {
          // Reset elements that are below viewport
          element.style.opacity = 0;
          element.style.transform = 'translateY(20px)';
          element.classList.remove('revealed');
          
          // Reset card animations
          const cards = element.querySelectorAll('.card-fade');
          cards.forEach(card => {
            card.classList.remove('card-revealed');
          });
        }
      });
      
      // Toggle back to top button visibility
      if (window.pageYOffset > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
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
            {/* <div className="dropdown">
              <span>Real Estate Education</span>
              <span className="dropdown-arrow">▼</span>
            </div> */}
          <Link to="/about" className="arrow-button">About us <span className="arrow-icon"></span></Link>
          <Link to="/contact" className="arrow-button">Contact Us <span className="arrow-icon"></span></Link>
          <Link to="/auth-login" className="arrow-button">Login <span className="arrow-icon"></span></Link>
            <Link to="/auth-mainpage" className="arrow-button">Home <span className="arrow-icon"></span></Link>
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
            <button className="get-started-btn">Get Started</button>
          </div>
        </div>
      </div>

      {/* Contact Hero Section */}
      <div className="sms-leader-banner about-hero-section7 scroll-reveal">
        <div className="container contact-hero-container" ref={headerRef}>
          <h1 className="contact-hero-title">Contact Us</h1>
          <p className="contact-hero-subtitle">
            Have questions or need assistance? Our team is here to help you succeed.
          </p>
        </div>
      </div>

      {/* Contact Form and Info Section */}
      <div className="contact-main-section">
        <div className="container contact-container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-wrapper scroll-reveal" ref={formRef}>
              <div className="contact-form-card card-fade">
                <h3 className="form-title">Send Us a Message</h3>
                <p className="form-subtitle">Fill out the form below and we'll get back to you as soon as possible.</p>
                
                {formSubmitted ? (
                  <div className="form-success-message">
                    <div className="success-icon">✓</div>
                    <h3>Thank You!</h3>
                    <p>Your message has been sent successfully. We'll get back to you shortly.</p>
                  </div>
                ) : (
                  <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        className={formErrors.name ? 'error' : ''}
                      />
                      {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          className={formErrors.email ? 'error' : ''}
                        />
                        {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input 
                          type="tel" 
                          id="phone" 
                          name="phone" 
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={formErrors.phone ? 'error' : ''}
                        />
                        {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject" 
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={formErrors.subject ? 'error' : ''}
                      />
                      {formErrors.subject && <span className="error-message">{formErrors.subject}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea 
                        id="message" 
                        name="message" 
                        rows="5"
                        value={formData.message}
                        onChange={handleInputChange}
                        className={formErrors.message ? 'error' : ''}
                      ></textarea>
                      {formErrors.message && <span className="error-message">{formErrors.message}</span>}
                    </div>
                    
                    <button type="submit" className="submit-button">Send Message</button>
                  </form>
                )}
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="contact-info-wrapper scroll-reveal" ref={infoRef}>
              <div className="contact-info-card card-fade">
                <h3 className="info-title">Contact Information</h3>
                <p className="info-subtitle">Connect with us directly or visit our office.</p>
                
                <div className="contact-info-items">
                  <div className="contact-info-item">
                    <div className="info-icon"><FaLocationDot /></div>
                    <div className="info-content">
                      <h3>Our Office</h3>
                      <p>123 Real Estate Avenue, Suite 200<br />San Francisco, CA 94105</p>
                    </div>
                  </div>
                  
                  <div className="contact-info-item">
                    <div className="info-icon"><FaPhone /></div>
                    <div className="info-content">
                      <h3>Phone</h3>
                      <p>Main: (555) 123-4567<br />Support: (555) 987-6543</p>
                    </div>
                  </div>
                  
                  <div className="contact-info-item">
                    <div className="info-icon"><FaEnvelope /></div>
                    <div className="info-content">
                      <h3>Email</h3>
                      <p>info@novablast.com<br />support@novablast.com</p>
                    </div>
                  </div>
                  
                  <div className="contact-info-item">
                    <div className="info-icon"><FaClock /></div>
                    <div className="info-content">
                      <h3>Business Hours</h3>
                      <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="social-connect">
                  <h3>Connect With Us</h3>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="contact-map-section scroll-reveal">
        <div className="container">
          <div className="map-wrapper card-fade">
            <div className="map-placeholder">
              <div className="map-overlay">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d235003.9883581473!2d72.5680128!3d23.0260736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1746026890382!5m2!1sen!2sin"
                  style={{ border: 0, width: '100%', height: '100%' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="contact-faq-section">
        <div className="container contact-faq-container scroll-reveal" ref={faqRef}>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item card-fade">
              <h3 className="faq-question">How quickly can I get set up with NovaBlast?</h3>
              <p className="faq-answer">Most clients are up and running within 24 hours of signing up. Our onboarding team will guide you through the process to ensure a smooth transition.</p>
            </div>
            
            <div className="faq-item card-fade">
              <h3 className="faq-question">Do you offer custom solutions for real estate teams?</h3>
              <p className="faq-answer">Yes! We offer specialized packages for real estate teams of all sizes. Contact our sales team to discuss your specific requirements.</p>
            </div>
            
            <div className="faq-item card-fade">
              <h3 className="faq-question">Is NovaBlast compliant with SMS marketing regulations?</h3>
              <p className="faq-answer">Absolutely. Our platform is built with compliance in mind, including TCPA regulations. We provide all the necessary tools to maintain compliance.</p>
            </div>
            
            <div className="faq-item card-fade">
              <h3 className="faq-question">Can I integrate NovaBlast with my existing CRM?</h3>
              <p className="faq-answer">Yes, we offer integrations with most popular real estate CRMs. Our team can help you set up the integration for seamless operation.</p>
            </div>
            
            <div className="faq-item card-fade">
              <h3 className="faq-question">What kind of support do you offer?</h3>
              <p className="faq-answer">We provide comprehensive support including live chat, email, and phone support. Our team is available Monday through Friday, with limited weekend hours.</p>
            </div>
            
            <div className="faq-item card-fade">
              <h3 className="faq-question">Is there a long-term contract required?</h3>
              <p className="faq-answer">No, we offer month-to-month subscriptions with no long-term commitment required. However, we do offer discounts for annual subscriptions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="sms-leader-banner about-hero-section7 scroll-reveal">
        <div className="container contact-cta-container scroll-reveal">
          <h1 className='about-hero-title'>Ready to Get Started with NovaBlast?</h1>
          <p>Join thousands of successful real estate professionals who are growing their business with our platform.</p>
          <div className="cta-buttons">
            <Link to="/auth-mainpage" className="cta-button primary">View Pricing</Link>
            <Link to="/" className="cta-button secondary">Sign Up Now</Link>
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
      
      {/* Back to Top Button */}
      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <FaChevronUp />
      </button>
    </>
  );
}

export default ContactPage;