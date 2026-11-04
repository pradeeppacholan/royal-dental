import React, { useEffect, useRef, useState } from 'react';
import { faqs, serviceGroups, treatments, slugify } from '../data';

const configuredValue = (value = '') => value.trim().toLowerCase() === 'royal123' ? '' : value.trim();
const rawWhatsApp = configuredValue(import.meta.env.VITE_WHATSAPP_NUMBER) || '9095650050';
const cleanedWa = rawWhatsApp.replace(/\D/g, '');
const whatsappNumber = cleanedWa.length === 10 ? `91${cleanedWa}` : cleanedWa;
const reviewUrl = configuredValue(import.meta.env.VITE_GOOGLE_REVIEWS_URL);
const facebookUrl = configuredValue(import.meta.env.VITE_FACEBOOK_URL);
const instagramUrl = configuredValue(import.meta.env.VITE_INSTAGRAM_URL);

export function WhatsAppLink({ children = 'Chat on WhatsApp', message = 'Hello, I would like to ask about a dental appointment.', className = 'button button-dark', ariaLabel }) {
  const href = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}` : '/contact';
  return <a className={className} href={href} aria-label={ariaLabel} target={whatsappNumber ? '_blank' : undefined} rel={whatsappNumber ? 'noreferrer' : undefined}>{children}<span>↗</span></a>;
}

function SocialIcon({ name }) {
  if (name === 'whatsapp') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.8a8.4 8.4 0 0 1-12.4 7.4L4 20l.9-4A8.4 8.4 0 1 1 20.5 11.8Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M8.7 8.1c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4-.1.6l-.6.7c-.2.2-.2.4 0 .6.5.9 1.2 1.5 2.1 2 .2.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.3.3.6-.1.6-.4 1.2-.9 1.5-.5.4-1.2.6-1.8.4-1-.2-2.2-.8-3.5-1.9-1.2-1-2.1-2.3-2.4-3.3-.3-.9-.1-1.8.6-2.6Z" fill="currentColor" /></svg>;
  if (name === 'instagram') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.6" cy="6.7" r="1.1" fill="currentColor" /></svg>;
  if (name === 'facebook') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.3v2.1H7.6V13h2.7v8h3.2Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.8 3-4.3 3-7.3Z" fill="#4285F4" /><path d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3.1v2.6A10 10 0 0 0 12 22Z" fill="#34A853" /><path d="M6.4 13.8a6 6 0 0 1 0-3.7V7.5H3.1a10 10 0 0 0 0 8.9l3.3-2.6Z" fill="#FBBC05" /><path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.7 9.7 0 0 0 12 2a10 10 0 0 0-8.9 5.5l3.3 2.6C7.2 7.8 9.4 6 12 6Z" fill="#EA4335" /></svg>;
}

export function Header({ current }) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [darkTheme, setDarkTheme] = useState(() => {
    try { return window.localStorage.getItem('rdcc-theme') === 'dark'; }
    catch { return false; }
  });
  useEffect(() => {
    document.documentElement.dataset.theme = darkTheme ? 'dark' : 'light';
    try { window.localStorage.setItem('rdcc-theme', darkTheme ? 'dark' : 'light'); }
    catch { /* Theme still works for this visit when storage is unavailable. */ }
  }, [darkTheme]);
  const links = [['Home', '/'], ['About Us', '/about'], ['Our Doctors', '/doctors'], ['Gallery', '/gallery'], ['Contact Us', '/contact']];
  return <header className="site-header"><div className="site-header-inner">
    <a className="site-brand" href="/" aria-label="Royal Dental Care home"><img className="brand-logo" src="/assets/rdcc-logo.png" alt="" /><span><b>Royal Dental Care</b></span></a>
    <button className="site-menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button>
    <nav className={`site-nav${open ? ' is-open' : ''}`} aria-label="Main navigation">
      {links.slice(0, 2).map(([name, href]) => <a key={href} className={current === href ? 'is-current' : ''} href={href} onClick={() => setOpen(false)}>{name}</a>)}
      <div className={`nav-services${servicesOpen ? ' is-open' : ''}`} onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
        <button type="button" aria-expanded={servicesOpen} onClick={() => setServicesOpen(!servicesOpen)}>Services</button>
        <div className="services-mega-menu">{serviceGroups.map(([group, items]) => <div key={group}><h3><a href={`/services/${slugify(group)}`} onClick={() => { setOpen(false); setServicesOpen(false); }}>{group}</a></h3>{items.map((item) => <a key={item} href={`/treatments/${slugify(item)}`} onClick={() => { setOpen(false); setServicesOpen(false); }}>{item}</a>)}</div>)}<a className="mega-all-link" href="/services" onClick={() => setOpen(false)}>View all services <span>↗</span></a></div>
      </div>
      {links.slice(2).map(([name, href]) => <a key={href} className={current === href ? 'is-current' : ''} href={href} onClick={() => setOpen(false)}>{name}</a>)}
      <button className="theme-toggle" type="button" onClick={() => setDarkTheme(!darkTheme)} aria-label={`Switch to ${darkTheme ? 'light' : 'dark'} theme`} aria-pressed={darkTheme}><span aria-hidden="true">{darkTheme ? '☀' : '☾'}</span><span className="theme-toggle-label">{darkTheme ? 'Light' : 'Dark'}</span></button>
      <a className="site-nav-cta" href="/booking" onClick={() => setOpen(false)}><span>▦</span> Book an appointment</a>
    </nav>
  </div></header>;
}

export function Footer() {
  const instagram = configuredValue(instagramUrl) || 'https://www.instagram.com/dr.k.s.omfs_rajeswari_dental08/';
  const facebook = configuredValue(facebookUrl) || 'https://www.facebook.com/search/top?q=Royal%20Dental%20Care%20Salem';
  const maps = 'https://www.google.com/maps/search/?api=1&query=Royal+Dental+Care+Chinna+Tirupathi+Salem';
  return <footer className="site-footer"><div className="site-footer-inner">
    <div className="footer-about"><a className="site-brand footer-brand" href="/" aria-label="Royal Dental Care home"><img className="brand-logo" src="/assets/rdcc-logo.png" alt="" /><span><b>Royal Dental Care</b></span></a><p>Personalised dental care, clear guidance, and a warm welcome for every smile.</p></div>
    <div className="footer-link-group"><h3>Explore</h3><a href="/">Home</a><a href="/about">About Us</a><a href="/services">Our Treatments</a><a href="/doctors">Our Dentist</a><a href="/#reviews-heading">Patient Reviews</a><a href="/#faq">FAQs</a><a href="/contact">Contact Us</a></div>
    <div className="footer-link-group"><h3>Popular Treatments</h3><a href="/services/general-dental-care">General Dentistry</a><a href="/treatments/scaling-gum-care">Dental Cleaning and Polishing</a><a href="/treatments/teeth-whitening">Teeth Whitening</a><a href="/treatments/decayed-tooth-filling-rct">Root Canal Treatment</a><a href="/treatments/decayed-tooth-filling-rct">Dental Fillings</a><a href="/treatments/wisdom-teeth-removal">Tooth Extraction</a><a href="/treatments/braces-aligners">Braces and Orthodontics</a><a href="/treatments/crown-bridge">Crowns and Bridges</a><a href="/treatments/dental-implants">Dental Implants</a><a href="/booking">Pediatric Dentistry</a></div>
    <div className="footer-link-group"><h3>Patient Information</h3><a href="/booking">Book an Appointment</a><a href="/about#clinic-journey">First Visit Guide</a><a href="/about#clinic-journey">Dental Care Tips</a><a href="/#faq">Frequently Asked Questions</a><a href="/booking">Appointment Policies</a></div>
    <div className="footer-link-group footer-contact"><h3>Get in Touch</h3><p><b>📍 Visit Our Clinic</b><br />Clinic I: 94/2, Kannan Nilayam, Kannakurichi Main Road, Chinna Tirupathi, Salem – 8<br />Clinic II: 48, Maruthi Nagar, Chinna Tirupathi, Salem – 8</p><a href="tel:+919095650050">📞 +91 90956 50050</a><a href="tel:+918220094802">+91 82200 94802</a><p>✉ Email Us: Please call the clinic for contact details.</p><a href="https://royaldentalsalem.in" target="_blank" rel="noreferrer">🌐 royaldentalsalem.in ↗</a><p className="hours-note">Opening hours: Please call to confirm.</p><div className="footer-social"><h3>Connect with us</h3><div><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" title="WhatsApp"><SocialIcon name="whatsapp" /></a><a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram"><SocialIcon name="instagram" /></a><a href={facebook} target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook"><SocialIcon name="facebook" /></a><a href={maps} target="_blank" rel="noreferrer" aria-label="Google Maps" title="Google Maps"><SocialIcon name="google" /></a></div><p className="instagram-handle">@dr.k.s.omfs_rajeswari_dental08</p></div></div>
  </div><div className="footer-bottom"><span>© {new Date().getFullYear()} Royal Dental Care</span><span>Patient-first care. Every visit.</span></div></footer>;
}

export function PageShell({ current, title, children }) {
  useEffect(() => {
    const titles = { '/': 'Royal Dental Care | Expert Dental Care', '/about': 'About Us | Royal Dental Care', '/doctors': 'Our Doctors | Royal Dental Care', '/services': 'Dental Services | Royal Dental Care', '/gallery': 'Clinic Gallery | Royal Dental Care', '/contact': 'Contact | Royal Dental Care', '/booking': 'Book an Appointment | Royal Dental Care' };
    document.title = title || titles[current] || titles['/'];
  }, [current, title]);
  return <><Header current={current} />{children}<Footer /><WhatsAppLink className="whatsapp-float" message="Hello, I would like to book a dental appointment."><svg className="wa-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.8 11.8 0 0 0 12.12 0C5.58 0 .26 5.32.26 11.86c0 2.09.55 4.13 1.59 5.93L.16 24l6.38-1.67a11.83 11.83 0 0 0 5.58 1.42h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.47-8.41ZM12.13 21.7h-.01a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.79.99 1.01-3.7-.23-.38a9.82 9.82 0 1 1 8.37 4.67Zm5.39-7.36c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.64-.94-2.24-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.51s1.08 2.91 1.23 3.11c.15.2 2.12 3.24 5.13 4.54.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" fill="currentColor" /></svg><span className="wa-label">WhatsApp us</span></WhatsAppLink></>;
}

export function SectionHeading({ eyebrow, title, text }) {
  return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

export function AppointmentForm({ initialService = '' }) {
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true); setNotice('');
    try {
      const response = await fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patient_name: form.get('name'), phone: form.get('phone'), email: form.get('email'), appointment_date: form.get('date'), appointment_time: form.get('time'), service: form.get('treatment'), branch: form.get('location'), notes: form.get('message') }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not submit your request. Please call the clinic.');
      setBooking({ reference: result.bookingReference, ...result.data });
    } catch (error) { setNotice(error.message || 'The request could not be submitted. Please try again or call the clinic.'); }
    finally { setSubmitting(false); }
  }
  if (booking) return <div className="booking-success-card" role="status"><span className="booking-success-icon">✓</span><span className="eyebrow">Request received</span><h3>Your appointment request is saved.</h3><p>The clinic will contact you to confirm availability. This is not a confirmed appointment yet.</p><span className="booking-ref-chip">Reference <b>{booking.reference}</b></span><div className="booking-summary-box"><div><b>Service</b><span>{booking.service}</span></div><div><b>Preferred date & time</b><span>{booking.appointment_date} · {booking.appointment_time}</span></div><div><b>Clinic</b><span>{booking.branch}</span></div></div><button type="button" className="button button-outline new-booking-btn" onClick={() => { setBooking(null); setNotice(''); }}>Make another request</button></div>;
  return <form className="appointment-form" onSubmit={submit}>
    <div className="form-grid"><label>Your Full Name *<input name="name" placeholder="e.g. Rajesh Kumar" autoComplete="name" maxLength="120" required /></label><label>Phone Number *<input name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" maxLength="32" required /></label><label>Email Address (Optional)<input name="email" type="email" placeholder="you@example.com" autoComplete="email" maxLength="254" /></label><label>Treatment / Service *<select name="treatment" defaultValue={initialService || ''} required><option value="" disabled>Select a treatment</option>{treatments.map((item) => <option key={item.name}>{item.name}</option>)}<option>General consultation</option></select></label><label>Preferred Clinic Location *<select name="location" defaultValue="Clinic I (Kannakurichi)" required><option value="Clinic I (Kannakurichi)">Clinic I – Kannan Nilayam, Chinna Tirupathi</option><option value="Clinic II (Maruthi Nagar)">Clinic II – Maruthi Nagar, Chinna Tirupathi</option></select></label><label>Preferred Date *<input name="date" type="date" min={minDate} required /></label><label>Preferred Time Slot *<select name="time" defaultValue="" required><option value="" disabled>Select a time slot</option><option>Morning: 10:00 AM – 11:00 AM</option><option>Morning: 11:00 AM – 12:00 PM</option><option>Afternoon: 2:00 PM – 3:00 PM</option><option>Afternoon: 3:00 PM – 4:00 PM</option><option>Evening: 4:00 PM – 5:00 PM</option><option>Flexible</option></select></label><label className="form-message">Describe any symptoms or specific requests<textarea name="message" rows="3" maxLength="1000" placeholder="Tell our dental team about any tooth pain, sensitivity, or previous treatments…" /></label></div>
    <div className="form-submit-row"><p>Your request is recorded right away. The clinic will contact you to confirm your visit.</p><button type="submit" className="button button-dark" disabled={submitting}>{submitting ? 'Submitting…' : 'Book Appointment Now'} <span>↗</span></button></div>
    {notice && <p className="form-feedback" role="status">{notice}</p>}
  </form>;
}

export function ContactForm() {
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); const form = new FormData(event.currentTarget); setBusy(true); setNotice('');
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.get('name'), phone: form.get('phone'), email: form.get('email'), subject: form.get('subject'), message: form.get('message') }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Could not send your message.');
      setNotice('Your message has been saved. The clinic team will contact you shortly.'); event.currentTarget.reset();
    } catch (error) { setNotice(error.message || 'Could not send your message. Please call the clinic.'); }
    finally { setBusy(false); }
  }
  return <form className="appointment-form contact-form" onSubmit={submit}><div className="form-grid">
    <label>Your name *<input name="name" autoComplete="name" maxLength="120" required /></label><label>Phone number *<input name="phone" type="tel" autoComplete="tel" maxLength="32" required /></label>
    <label>Email address<input name="email" type="email" autoComplete="email" maxLength="254" /></label><label>Subject<input name="subject" defaultValue="General Inquiry" maxLength="160" /></label>
    <label className="form-message">How can we help? *<textarea name="message" rows="4" maxLength="2000" required /></label>
  </div><div className="form-submit-row"><p>We’ll use these details to reply to your enquiry.</p><button className="button button-dark" disabled={busy}>{busy ? 'Sending…' : 'Send enquiry'} <span>↗</span></button></div>{notice && <p className="form-feedback" role="status">{notice}</p>}</form>;
}

export function TreatmentCard({ item, index }) {
  const id = slugify(item.name);
  return <article id={id} className="treatment-card"><a className="treatment-image" href={`/treatments/${id}`} aria-label={`Explore ${item.name}`}><img src={`/assets/${item.image}`} alt="" loading={index > 2 ? 'lazy' : 'eager'} /><span className="image-arrow">↗</span></a><div className="treatment-copy"><span className="treatment-category">{item.category}</span><h3>{item.name}</h3><p>{item.text}</p><a href={`/treatments/${id}`} className="text-link">Explore treatment <span>→</span></a></div></article>;
}

export function Treatments({ limit }) {
  const [filter, setFilter] = useState('All Services');
  const categories = ['All Services'];
  const shown = treatments.filter((item) => filter === 'All Services' || item.category === filter);
  return <><div className="treatment-filters" aria-label="Filter treatments">{categories.map((category) => <button key={category} type="button" className={filter === category ? 'is-active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div><div className="treatment-grid">{(limit ? shown.slice(0, limit) : shown).map((item, index) => <TreatmentCard key={item.name} item={item} index={index} />)}</div></>;
}

export function FAQList() {
  const [active, setActive] = useState(0);
  return <div className="faq-list">{faqs.map(([question, answer], index) => <article className={`faq-item${active === index ? ' is-open' : ''}`} key={question}><button type="button" aria-expanded={active === index} onClick={() => setActive(active === index ? -1 : index)}><span>{question}</span><svg className="faq-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></button>{active === index && <p>{answer}</p>}</article>)}</div>;
}

export function PageHero({ eyebrow, title, text, image, backgroundImage = true, className = '' }) {
  const heroStyle = backgroundImage && image ? { '--hero-image': `url("/assets/${image}")` } : undefined;
  return <section className={`inner-hero${backgroundImage ? ' inner-hero--background' : ''}${className ? ` ${className}` : ''}`} style={heroStyle}><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p><a className="button button-dark" href="/booking">Book an appointment <span>↗</span></a></div>{image && !backgroundImage && <img src={`/assets/${image}`} alt="" />}</section>;
}

export function GoogleReviews() {
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState({ author_name: '', rating: 5, comment: '' });
  const [sending, setSending] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  const [error, setError] = useState('');
  const reviewTrackRef = useRef(null);
  const reviews = reviewData?.reviews || [];
  async function fetchReviews() {
    try {
      const response = await fetch('/api/reviews');
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Could not load reviews.');
      setReviewData(result.data);
    } catch (err) { setError(err.message || 'Could not load reviews.'); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    fetchReviews();
  }, []);
  useEffect(() => {
    if (reviews.length < 3 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => moveReviews(1), 3800);
    return () => window.clearInterval(timer);
  }, [reviews.length]);
  const mapsLink = reviewUrl || 'https://www.google.com/maps/search/?api=1&query=Royal+Dental+Care+Chinna+Tirupathi+Salem';
  const moveReviews = (direction) => {
    const track = reviewTrackRef.current;
    if (!track || reviews.length < 2) return;
    const card = track.querySelector('.review-card');
    const step = (card?.getBoundingClientRect().width || track.clientWidth) + 12;
    let current = Math.round(track.scrollLeft / step);
    if (direction > 0 && current >= reviews.length) { track.scrollLeft = 0; current = 0; }
    if (direction < 0 && current <= 0) { track.scrollLeft = reviews.length * step; current = reviews.length; }
    track.scrollTo({ left: (current + direction) * step, behavior: 'smooth' });
  };
  async function submitReview(event) {
    event.preventDefault(); setSending(true); setReviewMessage('');
    try {
      const response = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(review) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Could not submit your review.');
      setReviewMessage('Thank you for sharing your experience!'); setReview({ author_name: '', rating: 5, comment: '' }); await fetchReviews();
    } catch (err) { setReviewMessage(err.message || 'Could not submit your review.'); }
    finally { setSending(false); }
  }
  return <section className="google-reviews site-section" aria-labelledby="reviews-heading"><div className="reviews-heading"><span className="eyebrow">Patient Reviews</span><h2 id="reviews-heading">Real Smiles. Real Experiences.</h2><p>Your comfort and confidence matter to us. Read patient experiences and share feedback about your visit.</p><div className="reviews-action-links"><a className="google-review-link" href={mapsLink} target="_blank" rel="noreferrer">View us on Google Maps ↗</a><button type="button" className="write-review-btn" onClick={() => { setShowReviewForm(true); setReviewMessage(''); }}>★ Write a Patient Review</button></div></div>
    <div className="reviews-content"><div className="rating-summary"><span className="google-g">G</span><strong>{reviews.length ? Number(reviewData?.rating || 0).toFixed(1) : '—'}</strong><span className="stars" aria-label="5 out of 5 stars">★★★★★</span><small>{reviewData?.userRatingCount ?? reviews.length} Patient Reviews</small></div><div className="reviews-carousel"><div className="reviews-carousel-top"><span>{loading ? 'Loading patient reviews…' : error ? 'Reviews are temporarily unavailable' : `${reviews.length} patient ${reviews.length === 1 ? 'review' : 'reviews'}`}</span><div className="reviews-controls"><button type="button" aria-label="Previous reviews" onClick={() => moveReviews(-1)} disabled={reviews.length < 2}>←</button><button type="button" aria-label="Next reviews" onClick={() => moveReviews(1)} disabled={reviews.length < 2}>→</button></div></div>{reviews.length ? <div ref={reviewTrackRef} className="review-cards" aria-label="Patient reviews">{[...reviews, ...reviews].map((item, i) => { const name = item.authorAttribution?.displayName || item.author_name || 'Patient'; const rating = Math.max(0, Math.min(5, Math.round(Number(item.rating) || 5))); return <article className="review-card" key={`${item.name || item.id || i}-${i}`}><div className="review-stars" aria-label={`${rating} out of 5 stars`}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</div><p>{item.text?.text || item.comment || 'This review has no written comment.'}</p><div className="review-author"><div className="review-avatar-circle">{name.charAt(0).toUpperCase()}</div><span><b>{name}</b><small>{item.relativePublishTimeDescription || item.relative_time || 'Recently'}</small></span></div><a href={mapsLink} target="_blank" rel="noreferrer" className="review-source">View on Google Maps ↗</a></article>; })}</div> : <div className="reviews-empty"><div className="google-g">G</div><div><b>{loading ? 'Loading reviews' : error ? 'Reviews are temporarily unavailable' : 'Be the first to share your experience'}</b><p>{error || 'Patient feedback helps others feel comfortable choosing their dental care.'}</p></div></div>}</div></div>
    {showReviewForm && <div className="modal-backdrop" onClick={() => setShowReviewForm(false)}><div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="review-modal-title" onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close-btn" aria-label="Close review form" onClick={() => setShowReviewForm(false)}>×</button><span className="eyebrow">Share Your Feedback</span><h3 id="review-modal-title">Write a Patient Review</h3><p>Tell us about your experience at Royal Dental Care.</p>{reviewMessage && <p className="form-feedback" role="status">{reviewMessage}</p>}<form onSubmit={submitReview} className="review-modal-form"><label>Your Name *<input required maxLength="120" value={review.author_name} onChange={(event) => setReview({ ...review, author_name: event.target.value })} /></label><label>Rating *<select value={review.rating} onChange={(event) => setReview({ ...review, rating: Number(event.target.value) })}><option value="5">★★★★★ 5 - Excellent</option><option value="4">★★★★☆ 4 - Very good</option><option value="3">★★★☆☆ 3 - Good</option><option value="2">★★☆☆☆ 2 - Fair</option><option value="1">★☆☆☆☆ 1 - Needs improvement</option></select></label><label>Your Comments *<textarea rows="4" required maxLength="2000" value={review.comment} onChange={(event) => setReview({ ...review, comment: event.target.value })} /></label><div className="modal-buttons"><button type="button" className="button button-outline" onClick={() => setShowReviewForm(false)}>Close</button><button type="submit" className="button button-dark" disabled={sending}>{sending ? 'Submitting…' : 'Submit Review ↗'}</button></div></form></div></div>}
  </section>;
}
