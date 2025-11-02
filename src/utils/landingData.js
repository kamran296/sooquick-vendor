import Cleaning from "../assets/landing/cleaning.png";
import Repair from "../assets/landing/repair.png";
import Electricain from "../assets/landing/electricainn.png";
import Plumbing from "../assets/landing/plumber.png";
import Pest from "../assets/landing/pest.png";
import AboutStory from "../assets/landing/aboutStory.png";
import AboutMission from "../assets/landing/aboutMission.png";
// support icons
import Support1 from "../assets/landing//support1.png";
import Support2 from "../assets/landing/support2.png";
import Support3 from "../assets/landing/support3.png";
import Support4 from "../assets/landing/support4.png";

const servicesData = [
  {
    idx: 0,
    title: "Home / Office Services",
    image: Cleaning,
  },
  {
    idx: 1,
    title: "Grooming  /  Wellness",
    image: Repair,
  },
  {
    idx: 2,
    title: "Medical Service",
    image: Electricain,
  },
  {
    idx: 3,
    title: "transport Services",
    image: Plumbing,
  },
  // { idx: 4, title: "Pest Control", image: Pest },
];

const aboutStory = {
  desc: `SooQuick was born out of this everyday problem.

We realized that while the world was getting smarter and faster, basic services were still hard to find and book instantly. Either the platforms were limited to a few services, too slow to respond, or didn’t feel reliable. We thought: “Why can’t it all just happen... SooQuick?”

Whether you’re a student, a working professional, a homemaker, or a business owner—your time is valuable. And your peace of mind shouldn’t be compromised just to get everyday things done.

That’s why we created SooQuick—a one-stop platform where you get a wide range of reliable, verified services instantly. From plumbers to pet groomers, electricians to beauty experts, lab tests to delivery tasks—we’ve got you covered.
`,
  img: AboutStory,
};

const aboutMission = {
  desc: `Vision
At SooQuick, our vision is to become the first choice for booking trusted, reliable, and convenient services — not just in India, but across the globe. We aim to redefine how people connect with everyday services by building a brand rooted in trust, speed, and local empowerment.


Mission:
"SooQuick is on a mission to simplify how people book everyday services — by connecting customers with trusted local professionals through a seamless, fast, and reliable digital experience."
`,
  img: AboutMission,
};

const customerSteps = [
  {
    title: ` Browse & Discover Services`,
    desc: `Explore a wide range of local, verified services tailored to your needs — from home repair and grooming to legal or tech support.
Filter by category, service type, location, and ratings.`,
  },
  {
    title: " Book Instantly or Request Quotes",
    desc: `Choose a service provider and either book directly (if pricing is listed) or request a custom quote.
Provide details like time, location, special requirements.`,
  },
  {
    title: ` Transparent Pricing & Secure Payments`,
    desc: `Know what you're paying for. No hidden costs.
Pay securely through the platform (online wallet, card, UPI, or cash on service).
`,
  },
  {
    title: `  Track, Chat & Manage Appointments`,
    desc: `Get real-time updates about your service.
Chat with the service provider before they arrive.
Reschedule or cancel with ease (as per policy).`,
  },
  {
    title: ` Enjoy the Service & Rate Your Experience`,
    desc: `Service provider completes the job.
Rate them based on quality, punctuality, and professionalism — help others choose better.`,
  },
];

const vendorSteps = [
  {
    title: ` Browse & Discover Services`,
    desc: `Explore a wide range of local, verified services tailored to your needs — from home repair and grooming to legal or tech support.
Filter by category, service type, location, and ratings.`,
  },
  {
    title: " Book Instantly or Request Quotes",
    desc: `Choose a service provider and either book directly (if pricing is listed) or request a custom quote.
Provide details like time, location, special requirements.`,
  },
  {
    title: ` Transparent Pricing & Secure Payments`,
    desc: `Know what you're paying for. No hidden costs.
Pay securely through the platform (online wallet, card, UPI, or cash on service).
`,
  },
  {
    title: `  Track, Chat & Manage Appointments`,
    desc: `Get real-time updates about your service.
Chat with the service provider before they arrive.
Reschedule or cancel with ease (as per policy).`,
  },
  {
    title: ` Enjoy the Service & Rate Your Experience`,
    desc: `Service provider completes the job.
Rate them based on quality, punctuality, and professionalism — help others choose better.`,
  },
];

const customerFaqData = [
  {
    question: "How can SooQuick help my startup gain media exposure?",
    answer:
      "SooQuick leverages its network and expertise to craft compelling narratives and pitch your startup to relevant media outlets, ensuring your story gets the attention it deserves.",
    category: "visa",
  },
  {
    question: "What makes SooQuick different from other PR agencies?",
    answer:
      "We specialize in startups and understand the unique challenges you face. Our tailored approach and media relationships help amplify your message effectively.",
    category: "visa",
  },
  {
    question: "How long does it typically take to see results?",
    answer:
      "Results vary, but most clients see initial media placements within 4-6 weeks of engagement. Consistent coverage builds over time as relationships develop.",
    category: "startup",
  },
  {
    question: "What industries do you specialize in?",
    answer:
      "We have experience across tech, SaaS, fintech, healthtech, and consumer products, with particular expertise in early-stage innovation.",
    category: "branding",
  },
  {
    question: "Do you offer international media outreach?",
    answer:
      "Yes, we have media connections in North America, Europe, and Asia, and can tailor campaigns for specific regional markets.",
    category: "visa",
  },
];

const footerSupport = [
  {
    src: Support1,
    alt: "Partner 1",
    text: "For Customer Support - cs@sooquick.com",
  },
  { src: Support2, alt: "Partner 2", text: "Lorem ipsum dolor sit." },
  { src: Support3, alt: "Partner 3", text: "Lorem ipsum dolor sit." },
  { src: Support4, alt: "Partner 4", text: "Lorem ipsum dolor sit" },
];

const vendorFaqData = [
  {
    question: "How can SooQuick help my startup gain media exposure?",
    answer:
      "SooQuick leverages its network and expertise to craft compelling narratives and pitch your startup to relevant media outlets, ensuring your story gets the attention it deserves.",
    category: "visa",
  },
  {
    question: "What makes SooQuick different from other PR agencies?",
    answer:
      "We specialize in startups and understand the unique challenges you face. Our tailored approach and media relationships help amplify your message effectively.",
    category: "visa",
  },
  {
    question: "How long does it typically take to see results?",
    answer:
      "Results vary, but most clients see initial media placements within 4-6 weeks of engagement. Consistent coverage builds over time as relationships develop.",
    category: "startup",
  },
  {
    question: "What industries do you specialize in?",
    answer:
      "We have experience across tech, SaaS, fintech, healthtech, and consumer products, with particular expertise in early-stage innovation.",
    category: "branding",
  },
  {
    question: "Do you offer international media outreach?",
    answer:
      "Yes, we have media connections in North America, Europe, and Asia, and can tailor campaigns for specific regional markets.",
    category: "visa",
  },
];

export {
  servicesData,
  aboutStory,
  aboutMission,
  customerSteps,
  vendorSteps,
  customerFaqData,
  vendorFaqData,
  footerSupport,
};
