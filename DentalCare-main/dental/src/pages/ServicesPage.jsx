import { FAQList, PageHero, PageShell, SectionHeading, TreatmentCard } from '../components/Shared';
import { serviceGroups, treatments, slugify } from '../data';

export default function ServicesPage() {
  return <PageShell current="/services"><main>
    <PageHero eyebrow="Our treatments" title={<>Complete care for<br/><em>your whole smile.</em></>} text="Explore the dental services shown in our clinic’s care guide. Every treatment starts with an individual assessment and a conversation about your needs." image="clinic-dental-chair.jpg"/>
    <section className="service-topics site-section">
      <SectionHeading eyebrow="Choose a care area" title="Explore our four main services" text="Select a topic to see all related treatments and learn more about each service."/>
      <div className="service-topic-grid">{serviceGroups.map(([group, names], index) => {
        const id = slugify(group);
        const first = treatments.find((item) => item.name === names[0]);
        return <a className="service-topic-card" href={`/services/${id}`} key={group}>
          <img src={`/assets/${first.image}`} alt="" loading="lazy"/>
          <div><span className="eyebrow">{String(index + 1).padStart(2, '0')} / {names.length} SERVICES</span><h3>{group}</h3><p>{names.join(' · ')}</p><b>Explore this care area <span>↗</span></b></div>
        </a>;
      })}</div>
    </section>
    <section className="services-list site-section"><SectionHeading eyebrow="All services" title="Browse every treatment" text="Explore a service for more details, then request an appointment with our team."/><div className="service-directory">{serviceGroups.map(([group, items], groupIndex) => {
      const id = slugify(group);
      const cards = items.map((name) => treatments.find((item) => item.name === name)).filter(Boolean);
      return <section className="service-category" id={id} key={group}>
        <div className="service-category-heading"><span className="eyebrow">{String(groupIndex + 1).padStart(2, '0')} / CARE AREA</span><h2><a href={`/services/${id}`}>{group} <span>↗</span></a></h2><p>Explore these options with our dental team. The right care depends on an examination and your individual needs.</p><a className="text-link" href={`/services/${id}`}>View all services in this area <span>→</span></a></div>
        <div className="treatment-grid">{cards.map((item, index) => <TreatmentCard key={item.name} item={item} index={index}/>)}</div>
      </section>;
    })}</div></section>
    <section className="service-promise"><span className="eyebrow">Your comfort matters</span><h2>Not sure what you need?</h2><p>That’s okay. Book a consultation and we can talk through your concerns together.</p><a href="/booking" className="button button-light">Ask the dental team <span>↗</span></a></section>
    <section className="faq-section site-section"><SectionHeading eyebrow="Treatment questions" title="Before you decide"/><FAQList/></section>
  </main></PageShell>;
}
