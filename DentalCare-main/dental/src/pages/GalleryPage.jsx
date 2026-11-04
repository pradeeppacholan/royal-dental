import { PageHero, PageShell, SectionHeading } from '../components/Shared';

const photos = [
  ['clinic-reception.jpg', 'Clinic reception'],
  ['hd/image-1.jpg', 'A healthy smile'],
  ['hd/implant-closeup.jpg', 'Dental implant model'],
  ['clinic-treatment-room.jpg', 'Treatment room'],
  ['hd/image-3.jpg', 'Braces and orthodontic care'],
  ['clinic-waiting-room.jpg', 'Patient waiting area'],
  ['hd/image-4.jpg', 'Professional teeth whitening'],
  ['hd/image-8.jpg', 'Dental instruments and model teeth'],
  ['clinic-dental-chair.jpg', 'Dental treatment chair'],
  ['hd/image-6.jpg', 'Denture restoration'],
  ['clinic-exterior.jpg', 'Clinic exterior and greenery'],
  ['hd/image-2.jpg', 'Dental implant illustration'],
  ['clinic-consultation.jpg', 'Consultation space'],
  ['hd/image-5.jpg', 'Restorative dental care'],
  ['clinic-signage.jpg', 'Clinic signage'],
];

export default function GalleryPage() {
  return <PageShell current="/gallery"><main>
    <PageHero eyebrow="Our clinic" title={<>A closer look at<br/><em>your care.</em></>} text="Explore our clinic spaces alongside the dental care, treatments, and smiles we look after." image="clinic-exterior.jpg" backgroundImage/>
    <section className="gallery-section site-section">
      <SectionHeading eyebrow="Clinic & treatments" title="Care, people and the details" text="Browse a mix of our clinic spaces, dental treatments, and smiles."/>
      <div className="gallery-grid">{photos.map(([src, label], index) => <figure className={`gallery-item gallery-item-${index % 5}`} key={src}><img src={`/assets/${src}`} alt={label} loading="lazy"/><figcaption>{label}<span>↗</span></figcaption></figure>)}</div>
    </section>
  </main></PageShell>;
}
