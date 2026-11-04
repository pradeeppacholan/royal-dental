export const treatments = [
  { name: 'Decayed Tooth Filling / RCT', category: 'General dental care', image: 'hd/root-canal-treatment.png', text: 'Restore teeth affected by decay with appropriate dental treatment. Fillings repair cavities, while root canal treatment may help save a tooth when the inner pulp becomes infected or damaged.' },
  { name: 'Crowns for Fractured Teeth', category: 'General dental care', image: 'hd/implant-closeup.jpg', text: 'Protect and restore weakened, cracked, or damaged teeth with a custom-designed dental crown. Treatment is planned to improve tooth function, durability, and appearance.' },
  { name: 'Wisdom Teeth Removal', category: 'General dental care', image: 'hd/wisdom-tooth-removal.png', text: 'Experiencing pain or discomfort from your wisdom teeth? Our dental team can assess your condition and recommend appropriate treatment to address impaction, overcrowding, or other concerns.' },
  { name: 'Orofacial Pain Management', category: 'General dental care', image: 'hd/orofacial-pain-map.png', text: 'Get professional assessment and guidance for pain affecting the teeth, jaw, facial muscles, and surrounding areas. Treatment recommendations are tailored to your symptoms and individual needs.' },
  { name: 'Dental Implants', category: 'Restorative & implant dentistry', image: 'hd/image-2.jpg', text: 'A tooth-replacement option planned around your oral health, comfort, and individual needs.' },
  { name: 'Crown & Bridge', category: 'Restorative & implant dentistry', image: 'hd/image-5.jpg', text: 'Restore the shape and function of damaged or missing teeth with a tailored plan.' },
  { name: 'Complete Dentures', category: 'Restorative & implant dentistry', image: 'hd/image-6.jpg', text: 'Discuss complete tooth-replacement options designed for fit, comfort, and everyday use.' },
  { name: 'Implant-Supported Dentures', category: 'Restorative & implant dentistry', image: 'hd/implant-closeup.jpg', text: 'Explore dentures supported by dental implants, subject to an individual assessment.' },
  { name: 'Scaling & Gum Care', category: 'Periodontal (gum) care', image: 'hd/image-5.jpg', text: 'Professional cleaning and guidance to support healthy gums and day-to-day oral care.' },
  { name: 'Periodontal Surgeries', category: 'Periodontal (gum) care', image: 'hd/image-5.jpg', text: 'Surgical gum-care options discussed after a thorough periodontal assessment.' },
  { name: 'Gum Bleeding Treatment', category: 'Periodontal (gum) care', image: 'hd/image-7.jpg', text: 'Find the cause of gum bleeding and receive guidance on suitable care.' },
  { name: 'Regenerative Gum & Bone Surgeries', category: 'Periodontal (gum) care', image: 'hd/image-8.jpg', text: 'Specialist treatment planning for gum and bone concerns, based on clinical evaluation.' },
  { name: 'Smile Correction / Jaw Correction', category: 'Cosmetic & smile care', image: 'hd/image-3.jpg', text: 'Discuss smile and jaw alignment concerns and the options available for your needs.' },
  { name: 'Teeth Whitening', category: 'Cosmetic & smile care', image: 'hd/teeth-whitening-before-after.png', text: 'Ask about professional whitening options and what may be suitable for your smile.' },
  { name: 'Esthetic Restorations', category: 'Cosmetic & smile care', image: 'hd/image-1.jpg', text: 'Natural-looking restorations planned to improve the appearance and function of teeth.' },
  { name: 'Braces / Aligners', category: 'Cosmetic & smile care', image: 'hd/image-3.jpg', text: 'Explore braces or clear aligners with an orthodontic assessment and personalised plan.' },
];

export const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');

export const serviceGroups = [
  ['General dental care', ['Decayed Tooth Filling / RCT', 'Crowns for Fractured Teeth', 'Wisdom Teeth Removal', 'Orofacial Pain Management']],
  ['Restorative & implant dentistry', ['Dental Implants', 'Crown & Bridge', 'Complete Dentures', 'Implant-Supported Dentures']],
  ['Periodontal (gum) care', ['Scaling & Gum Care', 'Periodontal Surgeries', 'Gum Bleeding Treatment', 'Regenerative Gum & Bone Surgeries']],
  ['Cosmetic & smile care', ['Smile Correction / Jaw Correction', 'Teeth Whitening', 'Esthetic Restorations', 'Braces / Aligners']],
];

export const faqs = [
  ['How do I book an appointment?', 'You can book an appointment by calling our clinic or using the online appointment booking option on our website. Our team will help you find a convenient time for your visit.'],
  ['What should I bring to my first visit?', 'Please bring any relevant dental or medical records, a list of medications you currently take, and any previous dental X-rays you may have. This information can help our dentist understand your dental history'],
  ['Do you treat children?', 'Yes, our clinic welcomes children and aims to create a friendly, comfortable environment for young patients. We encourage regular dental check-ups to help children develop healthy oral hygiene habits.'],
  ['Can I get a treatment estimate before starting?', 'Yes. After examining your teeth and understanding your concerns, our dentist can explain the recommended treatment options and provide an estimated cost before treatment begins.'],
  ['How often should I visit the dentist?', 'Many people benefit from a dental check-up every six months. However, the ideal frequency depends on your oral health, medical history, and individual dental needs. Your dentist can recommend a suitable schedule.']
];
