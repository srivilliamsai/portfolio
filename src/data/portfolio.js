import { resolveBookingUrl, resolveContactEndpoint } from '../services/contactDelivery.js';

export const portfolio = {
  name: 'Sri Villiam Sai',
  repository: 'https://github.com/srivilliamsai/svs',
  github: 'https://github.com/srivilliamsai',
  linkedin: 'https://www.linkedin.com/in/srivilliamsai/',
  credentials: 'https://www.credly.com/users/srivilliamsai',
  email: 'srivilliamsai@gmail.com',
  contactFormUrl: resolveContactEndpoint(import.meta.env?.VITE_CONTACT_FORM_URL || 'https://formspree.io/f/xnpplzoz'),
  bookingUrl: resolveBookingUrl(import.meta.env?.VITE_BOOKING_URL || 'https://cal.com/srivilliamsai/30min'),
  reflection: 'I learn by building. Java lets me explore how software works behind the scenes; SwiftUI lets me explore how it feels to use.',
  education: {
    qualification: 'B.Tech. in Information Technology',
    institution: 'SRM Valliammai Engineering College, Chennai',
    period: 'October 2020–April 2024',
    source: '/static/media/resume.pdf',
  },
  currentEducation: {
    qualification: 'M.Tech in Artificial Intelligence',
    institution: 'SRM Institute of Science and Technology (SRMIST)',
    period: '2026–2028',
    status: 'Pursuing',
    expectedGraduation: '2028',
  },
};

export const skillGroups = [
  { title: 'Backend', number: '01', skills: ['Java', 'Spring Boot', 'REST APIs', 'SQL'], description: 'Turning data and business logic into useful services.', project: 'carbon-footprint', evidence: 'Explore Carbon Footprint' },
  { title: 'Web', number: '02', skills: ['React', 'JavaScript', 'HTML & CSS', 'Vite'], description: 'Building responsive interfaces people can navigate with confidence.', project: 'pitstop', evidence: 'Explore PitStop' },
  { title: 'iOS', number: '03', skills: ['Swift', 'SwiftUI', 'Async image loading', 'Native UI'], description: 'Making native interfaces feel considered, clear, and responsive.', project: 'wyndra', evidence: 'Explore Wyndra' },
  { title: 'Cloud & tools', number: '04', skills: ['Firebase', 'Cloudflare R2', 'Git', 'Postman'], description: 'Connecting applications to content and keeping development practical.', project: 'glassora', evidence: 'Explore Glassora' },
];

export const navigation = [
  { label: 'Projects', to: '/#projects' },
  { label: 'Skills', to: '/#skills' },
  { label: 'About me', to: '/#about-me' },
];
