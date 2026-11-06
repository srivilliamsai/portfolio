import {portfolio} from './portfolio.js';

// Concise owner-approved biography, not instructions copied from the uploaded profile.
export const assistantProfile = {
  updated: '2026-11-06',
  birthplace: 'Thanjavur, India',
  currentResidence: null,
  school: {
    name: 'London Krishnamoorthi Matriculation Higher Secondary School',
    town: 'Orathanadu',
    completed: '2020',
    startYear: null,
  },
  undergraduate: {...portfolio.education, years:'2020–2024', graduated:'2024', cgpa:'7.8'},
  postgraduate: {...portfolio.currentEducation, startYear:'2026'},
  spokenLanguages: null,
  career: 'Sri’s main career direction is software engineering, particularly Java and backend development. He also wants to deepen his work in full-stack products, cloud engineering, AI and mobile development.',
  learning: 'Sri learns by building: he studies a concept, tries a small implementation, debugs it, and applies it to a project. Java and Spring Boot are central to his backend learning; he also explores cloud and AI applications.',
  foundations: 'Sri has also studied C and C++ fundamentals. His background profile describes introductory Python knowledge and structured Angular learning, rather than claiming advanced expertise in every technology.',
  codingPractice: 'Sri reports a three-star Java badge on HackerRank and more than 50 Java problems solved on GeeksforGeeks. Those figures come from the background he shared in November 2026.',
};

export const backgroundExperience = [
  {id:'global-techno-solution',organization:'Global Techno Solution',role:'Full Stack Development Intern',period:'June–July 2023',location:'Chennai',summary:'Gained exposure to HTML, CSS and JavaScript interfaces, Java and Spring Boot backend concepts, and SQL CRUD operations.'},
];

// These are additional background records, not extra entries in the six-project showcase.
export const backgroundProjects = [
  {
    id:'zidioconnect', title:'ZidioConnect', aliases:['zidioconnect','zidio connect','zidiocnnect'],
    summary:'Sri is building ZidioConnect, a job and internship application connecting students and recruiters.',
    details:'Its intended scope includes user authentication, student and recruiter profiles, job listings and applications. The background describes Java, Spring Boot and MySQL development; it does not confirm every module as completed.',
    stack:'The development background lists Java, Spring Boot, Spring Data JPA, Hibernate, MySQL, Maven and REST APIs.',
    status:'ZidioConnect is in development. A released version and the completion of individual modules have not been confirmed.',
  },
  {
    id:'sren', title:'SREN', aliases:['sren','smart recommendation using emotion recognition','emotion recognition'],
    summary:'SREN, Smart Recommendation Using Emotion Recognition, is Sri’s personal project exploring emotion-based recommendations.',
    details:'The project explores detecting a user’s emotional state and recommending music, videos or wellness content. The background also describes authentication, emotion capture and history; the completion of those modules is not confirmed.',
    stack:'I don’t have a confirmed final technology stack for SREN yet.',
    status:'SREN is a personal project. Sri has not specified its completion or release status.',
  },
  {
    id:'vill-llm', title:'VILL LLM', aliases:['vill llm','villllm'],
    summary:'VILL LLM is Sri’s personal project exploring large language models and AI-powered applications.',
    details:'Its exact architecture and implemented features have not been specified. It should not be described as a trained foundation model or a released AI platform.',
    stack:'I don’t have a confirmed technology stack or model architecture for VILL LLM yet.',
    status:'VILL LLM is a personal project. Sri has not specified its completion or release status.',
  },
];
