"use client"; 

import dynamic from "next/dynamic";
import "../app/main.css";
import { motion } from "framer-motion";
import LoadingComponent from "./components/LoadingComponent";

// 📦 Динамическая загрузка компонентов с Placeholder
const Header = dynamic(() => import("@/app/components/header"), { ssr: false, loading: () => <LoadingComponent /> });
const HeroSection = dynamic(() => import("@/app/components/mainblock"), { ssr: false, loading: () => <LoadingComponent /> });
const Services = dynamic(() => import("@/app/components/services"), { ssr: false, loading: () => <LoadingComponent /> });
const Blog = dynamic(() => import("./components/blog"), { ssr: false, loading: () => <LoadingComponent /> });
const TestimonialsSection = dynamic(() => import("@/app/components/testimonials"), { ssr: false, loading: () => <LoadingComponent /> });
const ContactSection = dynamic(() => import("./components/contactSecton"), { ssr: false, loading: () => <LoadingComponent /> });
const Footer = dynamic(() => import("@/app/components/footer"), { ssr: false, loading: () => <LoadingComponent /> });

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Home() {
  return (
    <>
      <header className="header">
        <div className="container">
          <Header />
        </div>
      </header>

      <main className="main" id="main">
        <motion.section
          className="top"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="container">
            <HeroSection />
          </div>
        </motion.section>

        <motion.section
          className="services"
          id="services"
          initial="hidden"
          animate="visible"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div className="container">
            <Services />
          </div>
        </motion.section>

        <motion.section
          className="blog"
          initial="hidden"
          animate="visible"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div className="container">
            <Blog />
          </div>
        </motion.section>

        <motion.section
          className="testimonials"
          id="testimonials"
          initial="hidden"
          animate="visible"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div className="container">
            <TestimonialsSection />
          </div>
        </motion.section>

        <ContactSection />
      </main>

      <footer>
        <Footer />
      </footer>
    </>
  );
}
