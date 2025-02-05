import TestimonialsSection from "@/app/components/testimonials";
import Header from "@/app/components/header";
import Services from "@/app/components/services";
import Footer from "@/app/components/footer";
import HeroSection from "@/app/components/mainblock";
import { Typography } from "@mui/material";
import ContactForm from "@/app/components/form";
import "../app/main.css";
import Blog from "./components/blog";

export default function Home() {

  return (
    <>
      <header className="header">
      <div className="container">
      <Header/>

      </div>
      </header>
      <main className="main" id="main">
        {/* Top Section */}
        <section className="top">
           <div className="container">
            <HeroSection/>
          </div>
        </section>

        {/* Services Section */}
        <section className="services" id="services"> 
        <div className="container">
        <Services/>
        </div>
        </section>
        <div className="container">
          <Blog/>
        </div>
        <section className="testimonials" id="testimonials">
        <div className="container">
        <TestimonialsSection />
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
                <ContactForm/>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>

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
