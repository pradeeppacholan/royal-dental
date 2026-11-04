import { useEffect } from 'react';
import { PageHero, PageShell, WhatsAppLink } from '../components/Shared';

const profiles = [
  { number: '01', initials: 'KS', name: 'Dr. K. Saravanan', image: 'doctor-saravanan-clean.png', qualifications: 'MDS, MOMSRCPS, FDSRCPS (Glasgow, UK)', experience: '24 years of dental experience, including 17 years in clinical Oral & Maxillofacial Surgery.' },
  { number: '02', initials: 'MA', name: 'Dr. M. Amudha', image: 'doctor-amudha-hd.jpg', qualifications: 'BDS, 2000 batch · MDS, 2022 batch', experience: '20 years of dental experience · 3 years of clinical Periodontal Regenerative Surgery experience.' },
];

export default function DoctorsPage() {
  useEffect(() => {
    const cards = document.querySelectorAll('.doctor-profile-card');
    if (!('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return <PageShell current="/doctors"><main>
    <PageHero eyebrow="Meet the team" title={<>The people who<br/><em>care for your smile.</em></>} text="Get to know the dentists and specialists who will guide your dental care." image="dental-hero-modern.jpg" className="doctors-page-hero"/>
    <section className="doctor-list-section site-section"><div className="section-heading"><span className="eyebrow">Our doctors</span><h2>Professional care, personally delivered.</h2><p>Meet the dentists and specialists caring for our patients.</p></div><div className="doctor-profile-grid">{profiles.map(({ number, initials, name, image, qualifications, experience }) => <article className={`doctor-profile-card doctor-profile-card--${number}`} key={number}><div className="doctor-profile-copy"><span className="doctor-index">DOCTOR {number}</span><h3>{name}</h3><h4>{number === '01' ? 'Oral & Maxillofacial Surgery' : 'Periodontal Regenerative Surgery'}</h4><p><b>{qualifications}</b></p><p>{experience}</p>{number === '01' ? <><h5>Academic experience</h5><p>Progressed from Senior Lecturer to Head of Department in Oral & Maxillofacial Surgery at Saveetha Dental College, Vinayaka Mission’s Sankarachariyar Dental College, Salem, and Vivekanandha Dental College for Women, Tiruchengode.</p><h5>Clinical expertise</h5><ul><li>2011 · Started Rajeswari Speciality Dental Clinic, Chinna Thiruppathi.</li><li>2017–present · Consultant Faciomaxillary Surgeon at Kauvery Hospital, Salem.</li></ul></> : <><h5>Clinical expertise</h5><ul><li>2011 · Started Rajeswari Speciality Dental Clinic, Chinna Thiruppathi.</li><li>Consultant Periodontal Regenerative Specialist at dental clinics and hospitals across Salem.</li></ul></>}<a className="button button-dark" href="/booking">Book an appointment <span>↗</span></a></div><div className="doctor-avatar">{image ? <img src={`/assets/${image}`} alt={name} loading="lazy"/> : <span>{initials}</span>}<i>✳</i></div></article>)}</div></section>
    <section className="doctors-intro doctors-intro--text-only site-section"><div><span className="eyebrow">Care, with a human touch</span><h2>More than 2,00,000 patients treated.</h2><p>Countless confident smiles created through experienced, compassionate care. Our doctors take time to understand your concerns, explain your options, and help you feel comfortable about the next step.</p><WhatsAppLink message="Hello, I would like to know more about the doctors at your clinic.">Ask about our doctors</WhatsAppLink></div></section>
    
    <section className="doctors-bottom"><span className="eyebrow">Questions about your treatment?</span><h2>We’ll help you find the right next step.</h2><div><a className="button button-light" href="/booking">Book an appointment <span>↗</span></a><WhatsAppLink className="button button-outline-white">Message us</WhatsAppLink></div></section>
  </main></PageShell>;
}
