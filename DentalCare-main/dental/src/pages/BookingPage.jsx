import { AppointmentForm, PageShell, WhatsAppLink } from '../components/Shared';

export default function BookingPage() {
  const service = new URLSearchParams(window.location.search).get('service');
  return <PageShell current="/booking"><main><section className="booking-hero"><div className="booking-hero-copy"><span className="eyebrow">YOUR VISIT STARTS HERE</span><h1>Let’s Plan Your<br/><em>Next Visit.</em></h1><p>Choose a time that works for you. Share your details and our team will help arrange your appointment.</p><a className="button button-blue" href="#appointment-form">Book an Appointment <span>↗</span></a></div></section><section id="appointment-form" className="booking-content booking-page site-section"><div className="booking-aside"><span className="eyebrow">Appointment Enquiry</span><h2>Let’s find a time that works.</h2>
  <p>Share your contact details and preferred treatment. Your appointment is not confirmed until the clinic gets back to you.</p>
  <div className="booking-aside-card"><span>✳</span><div><b>What happens next?</b>
  <p>We’ll contact you to discuss availability and confirm your visit.</p>
  </div>
  </div><WhatsAppLink message="Hello, I would like to ask about an appointment.">Quick WhatsApp chat</WhatsAppLink></div>
  <div className="booking-form-card"><AppointmentForm initialService={service}/></div>
  </section></main></PageShell>;
}
