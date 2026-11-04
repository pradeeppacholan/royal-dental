import { PageHero, PageShell, SectionHeading, TreatmentCard } from '../components/Shared';
import { serviceGroups, treatments, slugify } from '../data';

export default function ServiceCategoryPage() {
  const slug = window.location.pathname.replace(/\/$/, '').split('/').pop();
  const group = serviceGroups.find(([name]) => slugify(name) === slug);
  if (!group) return <PageShell current="/services"><main className="not-found-section site-section"><SectionHeading eyebrow="Services" title="Care area not found" text="Browse all of our services to find the right care area."/><a className="button button-dark" href="/services">View all services <span>↗</span></a></main></PageShell>;
  const [name, itemNames] = group;
  const items = itemNames.map((itemName) => treatments.find((item) => item.name === itemName)).filter(Boolean);
  const image = items[0]?.image || 'hd/image-4.jpg';
  return <PageShell current="/services" title={`${name} | My Dental Clinic`}><main>
    <PageHero eyebrow="Our services" title={<>{name.split(' ').slice(0, -1).join(' ')}<br/><em>{name.split(' ').slice(-1)}</em></>} text={`Explore ${name.toLowerCase()} services. Each option begins with a personal assessment, clear guidance, and a plan suited to your needs.`} image={image}/>
    <section className="service-category-page site-section"><SectionHeading eyebrow="Services in this care area" title={`Explore ${name}`} text="Choose a treatment to read its details and request an appointment. Your dentist will discuss which options suit you after an assessment."/><div className="treatment-grid">{items.map((item, index) => <TreatmentCard key={item.name} item={item} index={index}/>)}</div></section>
    <section className="service-promise"><span className="eyebrow">Need help choosing?</span><h2>Talk with our dental team.</h2><p>Tell us what you’re experiencing and we’ll help you plan the next step.</p><a href="/booking" className="button button-light">Book an appointment <span>↗</span></a></section>
    <section className="service-back site-section"><a className="text-link" href="/services">← Back to all services</a></section>
  </main></PageShell>;
}
