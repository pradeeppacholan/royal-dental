# Dental Clinic React App

This project runs as a React app using Vite. Each website page has its own JSX file under `src/pages/`; shared navigation, services, booking, and reviews components are in `src/components/Shared.jsx`.

The only HTML file is the Vite entry document, `index.html`; all website pages and their content are JSX. Clinic address, phone, email, hours, and booking delivery need your real clinic details before appointment requests can be sent to your team.

## Connect clinic services

1. Copy `.env.example` to `.env.local`.
2. Replace `royal123` in `VITE_WHATSAPP_NUMBER` with the clinic WhatsApp phone number in international format, digits only (for example, India numbers start with `91`).
3. Replace `royal123` in `VITE_FACEBOOK_URL` and `VITE_INSTAGRAM_URL` with the clinic’s official profile URLs. Configured social links are shown in the footer.
4. For live Google ratings and reviews, replace `royal123` in `VITE_GOOGLE_PLACE_ID` and `VITE_GOOGLE_MAPS_API_KEY`. Enable Places API (New), set billing, and restrict the browser key to this website’s allowed referrers. `VITE_GOOGLE_REVIEWS_URL` can optionally point to the clinic’s Google reviews page.
5. Restart Vite after changing environment settings.

The booking form opens WhatsApp with the patient’s appointment details once a real WhatsApp number is configured. It does not send form data to a server. Replace `royal123` placeholders on the Our Doctors and Contact pages with verified clinic details. The separate Our Doctors page is available at `/doctors`.

## Run locally

1. Install Node.js if it is not already installed.
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.

Use `npm run build` to create a production build in `dist/`.
