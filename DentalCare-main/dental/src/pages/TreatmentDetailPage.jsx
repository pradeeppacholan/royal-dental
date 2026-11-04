import { PageHero, PageShell, SectionHeading, TreatmentCard } from '../components/Shared';
import { serviceGroups, treatments, slugify } from '../data';

export default function TreatmentDetailPage() {
  const slug = window.location.pathname.replace(/\/$/, '').split('/').pop();
  const item = treatments.find((treatment) => slugify(treatment.name) === slug);
  if (!item) return <PageShell current="/services"><main className="not-found-section site-section"><SectionHeading eyebrow="Treatments" title="Service not found" text="Browse all of our services to find what you’re looking for."/><a className="button button-dark" href="/services">View all services <span>↗</span></a></main></PageShell>;
  const group = serviceGroups.find(([name]) => name === item.category);
  const related = group?.[1].filter((name) => name !== item.name).map((name) => treatments.find((treatment) => treatment.name === name)).filter(Boolean) || [];
  const bookingHref = `/booking?service=${encodeURIComponent(item.name)}`;
  return <PageShell current="/services" title={`${item.name} | My Dental Clinic`}><main>
    <PageHero eyebrow={item.category} title={<>{item.name}<br/><em>care for your smile.</em></>} text={item.text} image={item.image}/>
    <section className="treatment-detail-section site-section"><div className="treatment-detail-copy"><span className="eyebrow">About this service</span><h2>Personal care, planned around you.</h2><p>{item.text}</p><p>Your dentist will assess your needs, explain suitable options, and discuss the next steps with you before treatment. The right approach depends on your individual examination.</p><a className="button button-dark" href={bookingHref}>Book an appointment <span>↗</span></a></div><div className="treatment-detail-note"><span>✳</span><div><b>What happens next?</b><p>Share this service with us when you request an appointment. Our team will contact you to discuss availability and help arrange a visit.</p></div></div></section>
    {related.length > 0 && <section className="related-services site-section"><SectionHeading eyebrow={item.category} title="Related services" text="Explore other care options in this area."/><div className="treatment-grid">{related.map((relatedItem, index) => <TreatmentCard key={relatedItem.name} item={relatedItem} index={index}/>)}</div></section>}
    <section className="service-back site-section"><a className="text-link" href={`/services/${slugify(item.category)}`}>← Back to {item.category}</a><span> · </span><a className="text-link" href="/services">All services</a></section>
  </main></PageShell>;
}
