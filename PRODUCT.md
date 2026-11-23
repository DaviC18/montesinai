# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** adults and older adults in Resende/RJ and nearby towns (Itatiaia, Porto Real, Quatis) who need a medical appointment or a lab/exam. Many are adult children booking for elderly parents.
- **Situation:** they arrive on a phone, from Google Maps or Instagram, often after failing to reach the clinic by phone. Their job: find out whether the clinic has the specialty/exam they need, whether it takes their health plan, when it is open, and book with as little friction as possible.

## Product Purpose

Single-page institutional site for Clínica Monte Sinai (polyclinic + laboratory). It exists to:

1. Give the clinic a trustworthy, professional digital presence (today it has only Google's automatic page).
2. Answer the most common questions on its own: specialties, exams, health plans, hours, directions.
3. Send the visitor to WhatsApp with a ready-made message that already states their intent.

Success = more appointment requests via WhatsApp and fewer failed contact attempts. Reviews (Google rating 3.0, 178 reviews) praise doctors and exams; complaints concentrate on phone (36 mentions), WhatsApp (17), scheduling (9) and front desk (7). The site must counter the "hard to get service" perception.

## Positioning

**Everything in one address:** consultations, exams and laboratory in the same building (R. Washington Luís, 120 – Vila Julieta, Resende). Supporting points: several specialties for the whole family, central location. "Humanized care" is the clinic's own claim but is not the lead message while the public rating contradicts it.

## Operating Context

- Visitors come mostly from mobile, via Google Maps listing or Instagram (@montesinairesende).
- Booking happens off-site on WhatsApp (`wa.me` link with prefilled message); the clinic staff confirms day and time. A WhatsApp automation (ZapResponse) is planned to receive these messages.
- No online scheduling, login, patient area, exam results, blog, CMS or forms collecting personal data in v1.

## Capabilities and Constraints

- Stack (fixed, see CLAUDE.md): Vite + React + TypeScript strict, Tailwind v4, shadcn/ui (base-nova on Base UI), React Bits / Magic UI, GSAP + @gsap/react, lucide-react, Vercel.
- All clinic content lives in `src/data/clinica.ts`; components never hard-code clinic text.
- Fields marked `pendente` / `TODO: confirmar com a clínica` are never shown as fact.
- Open/closed badge computed in America/Sao_Paulo from `clinica.horarios`; Saturday hours are unconfirmed, so the badge is hidden on Saturdays; Sunday is closed.
- **Undecided (awaiting the clinic):** official logo and colors, final specialty list and doctor names/CRM, lab exam list, accepted health plans, official WhatsApp booking number, Saturday hours, parking/building accessibility, CNPJ and technical director (legally required in medical advertising).

## Brand Commitments

- Name: **Clínica Monte Sinai**.
- Official tagline: **"Especialidades médicas e cuidado em um só lugar."**
- Institutional line (from Facebook): "Com uma equipe completa de profissionais e atendimento humanizado, a Clínica Monte Sinai é referência em saúde na região."
- Voice: close and direct. Speaks to "você", short clear sentences, plain Portuguese for older adults and people booking for their parents. Never "startup", never hype.
- Medical advertising compliance (CFM): no promised results, no "melhor clínica", no prices without authorization, no doctor name/CRM without clinic confirmation, no patient testimonials without authorization, never "24h" or "emergência".

## Evidence on Hand

- Logo: Instagram profile image only, low resolution. High-res logo pending.
- Photos: posts on the clinic's Instagram/Facebook (facade, reception, team). Usable only after the clinic authorizes and sends originals; no stock photos of fake doctors.
- Address, phone, geo, hours and social links: in `src/data/clinica.ts`.
- **Absent, must not be fabricated:** testimonials, ratings badges, doctor photos, prices, health-plan list as fact, exam list, patient counts or "years of experience" figures.

## Product Principles

1. **Booking in one tap.** Every path ends in a WhatsApp message that already says what the visitor wants.
2. **Answer before they ask.** Specialties, plans, hours and directions are findable without contacting anyone.
3. **Only confirmed truth.** Pending information stays hidden or clearly marked; trust is the product.
4. **One address for everything** is the story the page tells.
5. **Built for the phone and for older eyes.** Large type, high contrast, obvious actions.

## Accessibility & Inclusion

- WCAG 2.1 AA, keyboard navigation, visible focus, `prefers-reduced-motion` disables animation.
- Base font ≥ 18px; large touch targets; audience includes older adults and low-vision users.
- Tested at 360, 390, 768, 1024, 1440 px; Chrome, Safari iOS, Samsung Internet, Firefox.
