import { useEffect } from 'react';
import { PageHero, PageShell, SectionHeading } from '../components/Shared';

const clinicJourney = [
  ['01', 'Our Foundation', 'Dr. K. Saravanan (BDS – 1996) and Dr. M. Amudha (BDS – 2000) began their professional journeys in dentistry.'],
  ['02', 'Advanced Specialisation', 'Dr. Saravanan completed MDS in 2006, with international fellowships. Dr. Amudha completed MDS in 2022, specialising in Periodontal Regenerative Surgery.'],
  ['03', 'Our Clinic Established', 'In 2002, Royal Dental Clinic was established at Chinna Thiruppathi, Salem, with a vision of quality dental care.'],
  ['04', 'Growing Clinical Excellence', 'Since 2017, Dr. Saravanan has served at Kauvery Hospital, Salem, while Dr. Amudha provides specialised periodontal consultancy across Salem.'],
];

function AboutJourney() {
  useEffect(() => {
    const cards = document.querySelectorAll('.about-timeline-card[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('is-visible'));
      return undefined;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach((card) => card.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -5% 0px' });
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return <><section id="clinic-journey" className="about-journey-section">
    <div className="about-journey-heading"><span className="eyebrow">Our clinic journey</span><h2>Excellence Built Through Experience</h2><p>Discover the milestones behind our journey in specialised dental care.</p></div>
    <div className="about-timeline">{clinicJourney.map(([step, title, description], index) => <div className={`about-timeline-row ${index % 2 === 0 ? 'is-left' : 'is-right'}`} key={`clinic-${step}`}>
      <div className="about-timeline-marker"><span>{step}</span></div>
      <article className="about-timeline-card" data-reveal><span className="timeline-step">STEP {step}</span><h3>{title}</h3><p>{description}</p></article>
    </div>)}</div>
  </section></>;
}

export default function AboutPage() {
  return <PageShell current="/about"><main><PageHero eyebrow="A little about us" title={<>Care built around<br/>
  <em>your comfort.</em></>} text="We believe a better dental visit begins with trust, time, and a team that listens." image="hd/image-1.jpg"/>
  <section className="about-values site-section">
    <SectionHeading eyebrow="What matters to us" title="A few things you can always expect"/>
    <div className="values-grid"><article><span></span><h3>Compassion</h3>
    <p>We treat every person with kindness, patience, and respect.</p>
    </article><article><span></span><h3>Clear communication</h3>
    <p>We explain findings and options so you can make informed choices.</p>
    </article><article><span></span><h3>Thoughtful dentistry</h3>
    <p>We focus on prevention and care plans suited to your needs.</p>
    </article><article><span></span><h3>Welcome for all ages</h3>
    <p>We aim to make the clinic a comfortable place for every generation.</p>
    </article></div></section><section className="about-story">
      <img src="/assets/hd/image-8.jpg" alt="Dental instruments and a model of teeth" loading="lazy"/><div>
        <span className="eyebrow">Our approach</span><h2>Every smile has its own story.</h2>
        <p>Established in 2002, Royal Dental Clinic was founded with a vision to provide quality dental care with compassion and excellence.Led by Dr. K. Saravanan, an experienced Oral & Maxillofacial Surgeon, and Dr. M. Amudha, a specialist in Periodontal Regenerative Surgery.With decades of combined dental experience, our doctors bring specialised clinical expertise and professional excellence.</p>
        <p>Dr. Saravanan has served in reputed dental institutions and continues as a Consultant Faciomaxillary Surgeon at Kauvery Hospital, Salem.Dr. Amudha provides specialised periodontal regenerative care as a consultant across reputed clinics and hospitals in Salem.Our commitment is to deliver trusted treatment, personalised care and healthy smiles through excellence in dentistry.</p>
        <a href="/contact" className="text-link">Come say hello <span>→</span></a>
        </div></section><AboutJourney/><section id="doctors" className="about-team-section site-section">
          <SectionHeading eyebrow="Our dental team" title="Meet the people behind your care" text="Royal Dental Care combines attentive conversations with thoughtful dental care, helping you understand your options at every step."/>
          <div className="about-team-card"><img className="about-team-photo" src="/assets/hd/about-image-1.jpg" alt="A dentist discussing a dental model with a patient" loading="lazy"/><div className="about-team-copy"><img className="about-team-logo" src="/assets/rdcc-logo.png" alt="Royal Dental Care logo"/><span className="eyebrow">Patient-first care</span><h3>Clear guidance, from your first conversation.</h3><p>Tell us what matters to you. Our team will listen, explain suitable treatment options, and help you plan a comfortable next step.</p><div className="about-team-actions"><a className="button button-dark" href="/booking">Book an appointment <span>↗</span></a><a className="text-link" href="/contact">Contact the clinic <span>→</span></a></div></div></div>
        </section><section className="site-section"><SectionHeading eyebrow="How we care" title="The principles behind every visit"/>
          <div className="process-grid"><article>
            <span>01</span><h3>Listen first</h3>
            <p>Understand what matters to you before discussing treatment.</p>
            </article><article><span>02</span><h3>Explain clearly</h3><p>Share what we find and talk through suitable options.</p></article><article><span>03</span><h3>Care together</h3>
            <p>Agree on a comfortable plan and review progress as we go.</p></article></div></section></main></PageShell>;
}
