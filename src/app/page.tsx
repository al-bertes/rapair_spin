"use client"
import Image from "next/image";
import { useState } from "react";
import OutsideClickHandler from 'react-outside-click-handler';
import { motion, AnimatePresence } from 'framer-motion';
import ContactForm from "../components/form";
import TestimonialsSection from "@/components/testimonials";
// import Maintenance from "@/components/maintenance";
import Header from "@/components/header";
import Services from "@/components/services";
import Footer from "@/components/footer";
import HeroSection from "@/components/mainblock";
import { Typography } from "@mui/material";

export default function Home() {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupOpen, setIsPoupOpen] = useState(false);


  const closePopup = () => {
    setIsPoupOpen(false);
  };

  return (
    <>
      {/* Popup */}
      <OutsideClickHandler onOutsideClick={closePopup}>
        <AnimatePresence>
          {isPopupOpen && (
            <motion.div
              className={`popup ${isPopupOpen ? 'popup--open' : ''}`}
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
                <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mb: 4, textAlign: "center" }}
        >
          Have questions or need urgent assistance? Contact our team today! <br />
          We&apos;re here to help you with all your washing machine repair needs.
        </Typography>
                <ContactForm closePopup={closePopup} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </OutsideClickHandler>

      {/* Overlay */}
      {/* <div className={`overlay${isMenuOpen ? ' active' : ''}`}></div> */}
      <div className={`overlay-popup${isPopupOpen ? ' active' : ''}`}></div>

      {/* Header */}
      {/* <header className="header">
        <div className="container">
          <div className="header__inner">
            <a className="logo" href="#main">
              <Image src="./img/logo.svg" alt="logo" width={210} height={50} />
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
                </ul>
              </OutsideClickHandler>
            </nav>
          </div>
        </div>
      </header> */}
      <header className="header">
      <div className="container">
      <Header/>

      </div>
      </header>
      <main className="main" id="main">
        {/* Top Section */}
        <section className="top">
           <div className="container">
            <HeroSection setIsPopupOpen={setIsPoupOpen}/>
            {/*<div className="main__inform">
              <div className="top__inner">
                <h1>We Bring Your Appliances Back to Life</h1>
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
                  src="/img/main-picture.webp"
                  alt="Illustration of washing machine repair process"
                  width={500}
                  height={300}
                />
              </div>
            </div> */}
          </div>
        </section>

        {/* Services Section */}
        <section className="services" id="services"> 
        <div className="container">
        <Services/>
        </div>
        </section>
        {/* <section className="services" id="services">
        <div className="container">
            <div className="services__info">
              <h2 className="subtitle">Our services</h2>
              <div className="services__content">
                <ul className="services__list">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <li key={index} className="services__item">
                      <Image
                        className="services__item--img"
                        src={`/img/sercise${index}.webp`}
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
        </section> */}

        {/* Testimonials Section */}
        <section className="testimonials" id="testimonials">

        <div className="container">
        <TestimonialsSection />
        {/* <section className="testimonials" id="testimonials">
          <div className="testimonials__info">
            <h2 className="subtitle">What our customers are saying</h2>
            <p className="subtext testimonials__subtext">
              We pride ourselves on delivering exceptional service. <br />
              Here&apos;s what our customers have to say about their experience.
            </p>
            <ul className="testimonials__list"
            >
                {testimonials.map((testimonial, index) => (
                  <li className="testimonials__item" key={index}>
                    <p className="testimonials__name">{testimonial.name}</p>
                    <p className="testimonials__comment">{testimonial.comment}</p>
                  </li>
                ))}
              </ul>
          </div>
          </section> */}
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact" id="contact">
          <div className="container">
            <div className="contact__info">
            <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Get in touch with us
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Have questions or need urgent assistance? Contact our team today! <br />
          We&apos;re here to help you with all your washing machine repair needs.
        </Typography>
              <div className="contact__container">
                <ContactForm closePopup={closePopup} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        {/* <div className="container">
          <address className="footer">
            <p className="footer__text">Call Us: <a href="tel:+17634853734">+1 763-485-3734</a></p>
            <p className="footer__text"> Email: <a href="mailto:PavelsApplianceRepair@gmail.com">PavelsApplianceRepair@gmail.com</a></p>
            <p className="footer__text">
              Business Hours: Monday–Friday: 8:00 AM – 8:00 PM, Saturday: 9:00 AM – 6:00 PM
            </p>
          </address>
        </div> */}
        <Footer/>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Pavel's Appliance Repair",
            "telephone": "+17634853734",
            "email": "PavelsApplianceRepair@gmail.com",
            "openingHours": [
              "Mo-Fr 08:00-20:00",
              "Sa 09:00-18:00"
            ]
          })}
        </script>
      </footer>
    </>
    // <Maintenance/>
  );
}
