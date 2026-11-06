// Selected résumé skills displayed in the portfolio's Skills grid.
const skillVisuals = {
  Java: { src: '/static/media/skills/java.svg' },
  Python: { src: '/static/media/skills/python.svg' },
  SQL: { glyph: 'database' },
  JavaScript: { src: '/static/media/skills/javascript.svg' },
  TypeScript: { src: '/static/media/skills/typescript.svg' },
  'Spring Boot': { src: '/static/media/skills/spring.svg' },
  React: { src: '/static/media/skills/react.svg' },
  Angular: { src: '/static/media/skills/angular.svg' },
  'REST APIs': { glyph: 'network' },
  Kafka: { src: '/static/media/skills/apachekafka.svg' },
  'Distributed Systems': { glyph: 'servers' },
  'Google Cloud': { src: '/static/media/skills/googlecloud.svg' },
  AWS: { src: '/static/media/skills/amazonwebservices.svg' },
  Firebase: { src: '/static/media/skills/firebase.svg' },
  Docker: { src: '/static/media/skills/docker.svg' },
  Kubernetes: { src: '/static/media/skills/kubernetes.svg' },
  Figma: { src: '/static/media/skills/figma.svg' },
};

export const technicalSkillGroups = [
  { title: 'Languages', skills: ['Java', 'Python', 'SQL', 'JavaScript', 'TypeScript'] },
  { title: 'Frameworks', skills: ['Spring Boot', 'React', 'Angular'] },
  { title: 'Microservices', skills: ['REST APIs', 'Kafka', 'Distributed Systems'] },
  { title: 'DevOps & Cloud', skills: ['Google Cloud', 'AWS', 'Firebase', 'Docker', 'Kubernetes'] },
  { title: 'Tools', skills: ['Figma'] },
];

export const technicalSkills = technicalSkillGroups.flatMap(group => group.skills.map(name => ({ name, category: group.title, ...skillVisuals[name] })));
