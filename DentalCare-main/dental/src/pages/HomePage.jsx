import React, { useEffect, useState } from 'react';
import { FAQList, GoogleReviews, PageShell, SectionHeading, Treatments, WhatsAppLink } from '../components/Shared';
import { serviceGroups, slugify, treatments } from '../data';

const heroSlides = [
  ['clinic-reception.jpg', 'Welcome to our clinic reception'],
  ['clinic-treatment-room.jpg', 'Our dental treatment room'],
  ['clinic-waiting-room.jpg', 'Comfortable patient waiting area'],
  ['clinic-dental-chair.jpg', 'Dental care room'],
  ['clinic-consultation.jpg', 'A calm consultation space'],
  ['clinic-front-desk.jpg', 'Our clinic front desk'],
  ['clinic-exterior.jpg', 'A look inside our clinic'],
  ['clinic-treatment-view.jpg', 'Treatment room view'],
  ['clinic-consult-room.jpg', 'Dental consultation room'],
  ['clinic-signage.jpg', 'Royal Dental Care clinic sign'],
];

const careHighlights = [
  ['General dental care', 'Fillings, crowns, wisdom teeth care, and support for orofacial pain.'],
  ['Restorative & implant dentistry', 'Explore implants, crowns and bridges, and denture options.'],
  ['Periodontal (gum) care', 'Gum health support, periodontal treatment, and surgical options.'],
  ['Cosmetic & smile care', 'Discuss smile correction, whitening, esthetic restorations, and aligners.'],
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % heroSlides.length), 3500);
    return () => window.clearInterval(timer);
  }, []);

  return <PageShell current="/">
    <main>
      <section className="home-hero"><div className="home-hero-inner"><div className="hero-copy"><span className="eyebrow">A calmer kind of dental care</span><h1>Feel Good About<br /><em>Your Smile.</em></h1><p>Experience modern dentistry, compassionate care, and clear guidance—all in one welcoming place. We are committed to making every dental visit comfortable, helping you understand your treatment options, and supporting your journey toward a healthier smile.</p><div className="hero-actions"><a className="button button-dark" href="/booking">Book an appointment <span>↗</span></a><a className="button button-outline" href="/services">Explore our care</a></div><div className="hero-note"><span className="hero-note-icon">✳</span><span>Care that starts with listening<br /><b>For every age and every smile</b></span></div></div><div className="hero-art"><div className="hero-photo-main home-carousel" aria-roledescription="carousel" aria-label="Clinic photo slideshow"><img key={heroSlides[activeSlide][0]} className="hero-slide-image" src={`/assets/${heroSlides[activeSlide][0]}`} alt={heroSlides[activeSlide][1]} /></div><div className="hero-caption"><span>YOUR COMFORT COMES FIRST</span><b>A healthier smile, one visit at a time.</b></div><div className="hero-sparkle"></div></div></div><a className="scroll-cue" href="#welcome"><span></span></a></section>
      <section className="trust-strip" aria-label="Clinic care values"><div><span>01</span><b>Patient-First Approach</b></div><div><span>02</span><b>Clear Treatment Guidance</b></div><div><span>03</span><b>Care For The Whole Family</b></div><div><span>04</span><b>Comfort At Every Visit</b></div></section>
      <section id="welcome" className="welcome-section site-section"><div className="welcome-photo"><img src="/assets/clinic-front-desk.jpg" alt="Royal Dental Care clinic front desk" loading="lazy" /><span className="photo-sticker">A space made<br />for your comfort</span></div><div className="welcome-copy"><span className="eyebrow">PERSONALIZED CARE STARTS HERE</span><h2>Good Care Starts with a Good Conversation.</h2><p>Your smile deserves attention, understanding, and care tailored to your needs. We believe the best dental experiences begin by listening to your concerns, understanding your goals, and explaining your treatment options clearly.</p><p>Whether you're visiting us for a routine check-up or seeking advice about a specific dental concern, our team is here to help you feel informed, comfortable, and confident.</p><a href="/about" className="text-link">Get to know us <span>→</span></a><div className="welcome-signoff"><span>✳</span><span>Personal care, with a lighter touch<small>ROYAL DENTAL CARE</small></span></div></div></section>
      <section className="care-section site-section"><div className="section-head-row"><SectionHeading eyebrow="Care for every smile" title="Find the care you need" text="Explore our dental services and discover the right next step toward a healthier, more confident smile. We focus on personalised treatment, patient comfort, and helping you make informed decisions about your oral health." /><a href="/services" className="button button-outline">All treatments <span>↗</span></a></div><Treatments limit={4} /></section>
      <section className="home-features-section"><div className="home-features-heading"><span className="eyebrow">Features</span><h2>High-quality dental care</h2><p>Explore care options for a healthier smile, with guidance shaped around your needs.</p></div><div className="home-feature-grid">{careHighlights.map(([name, description], index) => <a className="home-feature-card" href={`/services/${slugify(name)}`} key={name}><span className="feature-icon" aria-hidden="true"></span><h3>{name}</h3><p>{description}</p><span className="feature-link">Explore care area <b>↗</b></span></a>)}</div></section>
      {/* <section className="home-stats-section" aria-label="Clinic service overview"><div className="home-stat-card"><span aria-hidden="true"></span><strong>{String(serviceGroups.length).padStart(2, '0')}</strong><b>Main care areas</b></div><div className="home-stat-card"><span aria-hidden="true"></span><strong>{treatments.length}</strong><b>Services to explore</b></div><div className="home-stat-card"><span aria-hidden="true"></span><strong>01</strong><b>Simple appointment request</b></div><div className="home-stat-card"><span aria-hidden="true"></span><strong>YOU</strong><b>Care planned around you</b></div></section> */}
      <section className="why-section"><div className="why-image"><img key={`why-${heroSlides[activeSlide][0]}`} src={`/assets/${heroSlides[activeSlide][0]}`} alt={heroSlides[activeSlide][1]} loading="lazy" /><div className="why-image-label"><span></span><b>Modern tools.<br />A human touch.</b></div><div className="why-slider-dots" role="group" aria-label="Choose a clinic photo">{heroSlides.map(([image, alt], index) => <button key={image} type="button" className={activeSlide === index ? 'is-active' : ''} aria-label={`Show image ${index + 1}: ${alt}`} aria-pressed={activeSlide === index} onClick={() => setActiveSlide(index)} />)}</div></div><div className="why-copy"><span className="eyebrow">The difference is in the details</span><h2>Thoughtful care, made around you.</h2><p>From your first question to your follow-up, we want the experience to feel clear, respectful, and unrushed.</p><div className="benefit-list"><article><span>01</span><div><h3>Care that listens</h3><p>We take time to understand your needs and explain your options in plain language.</p></div></article><article><span>02</span><div><h3>Modern treatment planning</h3><p>Digital tools and careful assessments help inform your personalised care plan.</p></div></article><article><span>03</span><div><h3>Support through every step</h3><p>Know what to expect before, during, and after your treatment.</p></div></article><article><span>04</span><div><h3>Family-friendly visits</h3><p>We welcome patients of all ages and help make visits feel more comfortable.</p></div></article></div></div></section>
      <section className="process-section site-section"><SectionHeading eyebrow="Your first visit" title="A Simple Path To Feeling Better" text="We listen, explain, and guide you toward the dental care that feels right for you. Our goal is to make every visit comfortable, every decision clear, and every smile healthier." /><div className="process-grid"><article><span>01</span><h3>Tell us what’s on your mind</h3><p>Every smile has a story. Share your dental concerns, symptoms, and goals with us. We take the time to listen, understand your needs, and help you feel confident about your oral health.</p></article><article><span>02</span><h3>Meet your dental team</h3><p>Get to know your dentist and our caring team. We believe in clear communication, compassionate care, and creating a welcoming environment where you feel comfortable asking questions.</p></article><article><span>03</span><h3>Choose your next step</h3><p>Explore your treatment options with confidence. We'll explain our recommendations, answer your questions, and help you understand the next steps toward a healthier smile.</p></article></div></section>
      <section className="appointment-band"><div><span className="eyebrow">YOUR SMILE DESERVES THE BEST CARE</span><h2>Let’s make your next visit a little easier.</h2>
        <p>Experience comfortable, personalized dental care designed around your needs.
          <br />Our team is committed to helping you maintain a healthy smile with professional treatment and compassionate care.</p>
      </div><WhatsAppLink className="button button-light">Schedule Your Visit</WhatsAppLink><span className="band-decoration">✳</span></section>
      <GoogleReviews />
      <section id="faq" className="faq-section site-section"><SectionHeading eyebrow="YOUR DENTAL CARE, EXPLAINED" title="Questions before your visit?" text="We understand that visiting a dentist can raise questions. Here are answers to some of the most common questions to help you feel prepared for your appointment." /><FAQList /></section>
    </main>
  </PageShell>;
}
