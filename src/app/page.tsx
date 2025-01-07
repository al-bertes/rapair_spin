"use client"
import Image from "next/image";
import { useState } from "react";
import OutsideClickHandler from 'react-outside-click-handler';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonials } from './constants';
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupOpen, setIsPoupOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closePopup = () => {
    setIsPoupOpen(false);
  };

  const containerVariants = {
    animate: {
      x: ["0%", "-100%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
        },
      },
    },
  };
  return (
    <>
      {/* Popup */}
      <OutsideClickHandler onOutsideClick={closePopup}>
      <AnimatePresence> 
      {isPopupOpen && (
        <motion.div 
          className={`popup ${isPopupOpen ? 'popup--open':''}`} 
          id="popup"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()} // Останавливаем всплытие событий
          >
         <div className="popup-content">
           <button className="menu__close-popup" onClick={closePopup}>
             <Image src="../img/close.svg" alt="menu-close" width={24} height={24} />
           </button>
           <p className="subtext contact__title">
             Have questions or need urgent assistance? Contact our team today!
           </p>
           {/* <form action="submit" method="post" className="form"> */}
           <form className="form">
             <input type="text" className="form__input" placeholder="Your name" />
             <input type="email" className="form__input" placeholder="Your email" />
             <textarea
               className="form__textarea"
               placeholder="Your message"
               rows={4}
             ></textarea>
             {/* Uncomment and configure reCAPTCHA if needed */}
             {/* <div className="g-recaptcha" data-sitekey="your-site-key"></div> */}
             {/* <button type="submit" className="button form__button" onClick={closePopup}> */}
             <button type="submit" className="button form__button" onClick={closePopup}>
               SUBMIT REQUEST
             </button>
           </form>
         </div>
      </motion.div>
)}
      </AnimatePresence>
      </OutsideClickHandler>

      {/* Overlay */}
      <div className={`overlay${isMenuOpen ? ' active' : ''}`}></div>
      <div className={`overlay-popup ${isPopupOpen ? 'active' : ''}`}></div>

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header__inner">
            <a className="logo" href="#main">
              <Image src="./img/logo.svg" alt="logo" width={140} height={50} />
            </a>
            <button className="burger" onClick={toggleMenu}>
              <Image src="/img/burger.svg" alt="menu" width={24} height={24} />
            </button>

            <nav className="menu">
            <OutsideClickHandler onOutsideClick={() => setIsMenuOpen(false)}>
              <ul className={`menu__list${isMenuOpen ? ' menu__list--open' : ''}`}>
                <li>
                  <button className="menu__close" onClick={closeMenu}>
                    <Image
                      src="/img/close.svg"
                      alt="menu-close"
                      width={24}
                      height={24}
                    />
                  </button>
                </li>
                <li className="menu__item" >
                  <a className="menu__link" href="#services" onClick={() => setIsMenuOpen(false)}>
                    services
                  </a>
                </li>
                <li className="menu__item">
                  <a className="menu__link" href="#testimonials" onClick={() => setIsMenuOpen(false)}>
                    testimonials
                  </a>
                </li>
                <li className="menu__item">
                  <a className="menu__link" href="#contact" onClick={() => setIsMenuOpen(false)}>
                    contact
                  </a>
                </li>
                <li>
                  <button className="button main__button mobile-menu-button">
                    REQUEST SERVICE
                  </button>
                </li>
              </ul>
            </OutsideClickHandler>
            </nav>
          </div>
        </div>
      </header>
      <main className="main" id="main">
      {/* Top Section */}
      <section className="top">
        <div className="container">
          <div className="main__inform">
            <div className="top__inner">
              <h1 className="top__title">
                Comprehensive Washing Machine Repair Services
              </h1>
              <p className="subtext top__text">
                Your washing machine deserves the best care. <br />
                Our trusted experts provide fast diagnostics, affordable repairs, and exceptional service.
                <br />
                Call us now and get your machine running like new!
              </p>
              <button className="button main__button" onClick={() => setIsPoupOpen(true)}>REQUEST SERVICE</button>
            </div>
            <div className="top__img">
              <Image
                className="top__img--img"
                src="/img/main-picture-tablet.svg"
                alt="Illustration of washing machine repair process"
                width={500}
                height={300}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <div className="container">
          <div className="services__info">
            <h2 className="subtitle">Our services</h2>
            <div className="services__content">
              <ul className="services__list">
                {[1, 2, 3, 4, 5].map((index) => (
                  <li key={index} className="services__item">
                    <Image
                      className="services__item--img"
                      src={`/img/sercise${index}.svg`}
                      alt={`Service ${index}`}
                      width={100}
                      height={100}
                    />
                    <p className="services__item--text">
                      {[
                        'Drum and Motor Repairs',
                        'Water System Repairs',
                        'Electrical and Sensor Repairs',
                        'General Diagnostics and Cleaning',
                        'Door and Seal Maintenance',
                      ][index - 1]}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="testimonials__info">
            <h2 className="subtitle">What our customers are saying</h2>
            <p className="subtext testimonials__subtext">
              We pride ourselves on delivering exceptional service. <br />
              Here&apos;s what our customers have to say about their experience.
            </p>
            <ul className="testimonials__list"
            >
                {testimonials.map((testimonial, index) => (
                  <motion.li className="testimonials__item" key={index} variants={containerVariants}
                  animate="animate">
                    <p className="testimonials__name">{testimonial.name}</p>
                    <p className="testimonials__comment">{testimonial.comment}</p>
                  </motion.li>
                ))}
              </ul>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="container">
          <div className="contact__info">
            <h2 className="subtitle contact__title">Get in touch with us</h2>
            <p className="subtext contact__title">
              Have questions or need urgent assistance? Contact our team today! <br />
              We&apos;re here to help you with all your washing machine repair needs.
            </p>
            <div className="contact__container">
              <form action="submit" method="post" className="form">
                <input type="text" className="form__input" placeholder="Your name" />
                <input type="email" className="form__input" placeholder="Your email" />
                <textarea className="form__textarea" placeholder="Your message" rows={4}></textarea>
                {/* Uncomment and configure reCAPTCHA if needed */}
                {/* <div className="g-recaptcha" data-sitekey="your-site-key"></div> */}
                <button type="submit" className="button form__button">
                  SUBMIT REQUEST
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer>
      <div className="container">
        <div className="footer">
          <p className="footer__text">Call Us: +1 (555) 123-4567</p>
          <p className="footer__text">Email: support@repairspin.com</p>
          <p className="footer__text">
            Business Hours: Monday–Friday: 8:00 AM – 8:00 PM, Saturday: 9:00 AM – 6:00 PM
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}
