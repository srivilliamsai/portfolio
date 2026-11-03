import { projects } from '../data/projects.js';
import { portfolio, skillGroups } from '../data/portfolio.js';

// Deliberately small, deterministic portfolio vocabulary. This is not an AI or a shell.
const wordCorrections = {
  acheive: 'achieve', achive: 'achieve', achived: 'achieved', achivement: 'achievement',
  achivements: 'achievements', acheived: 'achieved', acheivements: 'achievements',
  buliding: 'building', buiding: 'building', buildng: 'building', bulid: 'build',
  currenly: 'currently', curently: 'currently', currenty: 'currently',
  dealy: 'daily', dialy: 'daily', daly: 'daily', routin: 'routine',
  studing: 'studying', studiying: 'studying', lerning: 'learning', learing: 'learning',
  developmet: 'development', devlopment: 'development', developement: 'development',
  experince: 'experience', experiance: 'experience', levle: 'level', leval: 'level',
  skils: 'skills', skilla: 'skills', skil: 'skill', porject: 'project', porjects: 'projects',
  projct: 'project', projet: 'project', prject: 'project', proejct: 'project',
  carbom: 'carbon', carbn: 'carbon', footprit: 'footprint', footrpint: 'footprint',
  wyndara: 'wyndra', wyndraapp: 'wyndra', glassorra: 'glassora', pitstp: 'pitstop',
  jav: 'java', javscript: 'javascript', swfit: 'swift', swfitui: 'swiftui',
  contrubution: 'contribution', contibution: 'contribution', contributon: 'contribution',
  soruce: 'source', souce: 'source', architecutre: 'architecture',
  certificaitons: 'certifications', certfications: 'certifications',
  technolgies: 'technologies', technlogy: 'technology', detials: 'details', stak: 'stack',
  pirce: 'price', prcie: 'price', costt: 'cost', fre: 'free', frea: 'free',
};

const skillTopics = [
  { id: 'java', label: 'Java', pattern: /\bjava\b/, group: 0, projects: ['carbon-footprint'] },
  { id: 'spring', label: 'Spring Boot', pattern: /\bspring(?: boot)?\b/, group: 0, projects: ['carbon-footprint'] },
  { id: 'backend', label: 'Backend', pattern: /\b(?:backend|back end|rest|sql)\b/, group: 0, projects: ['carbon-footprint'] },
  { id: 'react', label: 'React', pattern: /\breact\b/, group: 1, projects: ['pitstop', 'carbon-footprint'] },
  { id: 'web', label: 'Web development', pattern: /\b(?:web|frontend|front end|javascript|html|css|vite|full stack|fullstack)\b/, group: 1, projects: ['pitstop', 'carbon-footprint'] },
  { id: 'ios', label: 'Native iOS / SwiftUI', pattern: /\b(?:ios|swiftui|swift|native ui|image loading)\b/, group: 2, projects: ['wyndra', 'glassora'] },
  { id: 'cloud', label: 'Cloud & tools', pattern: /\b(?:cloud|firebase|cloudflare|r2|git|postman|tools)\b/, group: 3, projects: ['glassora'] },
];

function normalizeQuestion(input) {
  const raw = String(input ?? '');
  // Bound work and decline code, command chains, URLs and control characters.
  if (!raw.trim() || raw.length > 400 || /[;<>|&=\/\\`$\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(raw)) return null;
  const value = raw.normalize('NFKC').toLowerCase().replace(/[’']/g, "'")
    .replace(/\bwhat's\b/g, 'what is').replace(/\byou're\b/g, 'you are')
    .replace(/\bit's\b/g, 'it is')
    .replace(/\bi'm\b/g, 'i am').replace(/\byour's\b/g, 'your')
    .replace(/[?!.,:()"'\-]/g, ' ').trim().replace(/\s+/g, ' ');
  if (!/^[a-z0-9 ]+$/.test(value) || value.split(' ').length > 65) return null;
  return value.split(' ').map((word) => Object.hasOwn(wordCorrections, word) ? wordCorrections[word] : word).join(' ')
    .replace(/\bpit stop\b/g, 'pitstop').replace(/\bcarbon personal footprint(?: app)?\b/g, 'carbon footprint')
    .replace(/\bswift ui\b/g, 'swiftui').replace(/\bi os\b/g, 'ios');
}

const mentions = (value, pattern) => pattern.test(value);
const questionCue = /\b(?:what|how|where|when|which|why|who|tell|explain|show|describe|share|give|can|do|does|are|is|have|has|did|about|details|level|experience|contribution|achievement|achievements|source|demo|status|architecture|routine)\b/;
const unsupported = /\b(?:password|secret|token|tax|taxes|salary|phone|address|age|girlfriend|boyfriend|politics|hack|exploit|malware|ignore|pretend|invent|fake|delete|execute|deploy|publish|sudo|install|calculate|weather today|forecast today|stock price|write code|generate code|tutorial|teach me|compare|versus|vs|not|never|without|except|don t|instead)\b/;
const currentCue = /\b(?:current|currently|now|today|these days|right now|in progress|next)\b/;
const learningCue = /\b(?:study|studies|studying|learning|learn|course|college|university|degree|education|student)\b/;
const buildingCue = /\b(?:build|building|working|work|developing|project|projects|employer|employment|job)\b/;

function projectTopic(value) {
  if (/\b(?:free|paid|price|pricing|cost|costs|pay|payment|subscription|purchases|charge|charges|fee|fees)\b/.test(value) || /^(?:please )?how much(?: is\b|$)/.test(value)) return 'pricing';
  if (/\b(?:source|code|repository|repo|github)\b/.test(value)) return 'source';
  if (/\b(?:demo|live|try|visit|link|store|download|downloadable)\b/.test(value)) return 'demo';
  if (/\b(?:architecture|backend|connected|connect|integration|integrated)\b/.test(value)) return 'architecture';
  if (/\b(?:technology|technologies|stack|tools|language|languages|java|react|swiftui|swift|firebase|weather data)\b/.test(value)) return 'technology';
  if (/\b(?:status|finished|complete|completed|production|released|published|users|impact|accurate|accuracy|measurements|verified)\b/.test(value)) return 'status';
  if (/\b(?:problem|purpose|solve|idea|why)\b/.test(value)) return 'problem';
  if (/\b(?:learn|learned|learning|lesson|lessons|challenge|challenges)\b/.test(value)) return 'learning';
  if (/\b(?:achieve|achieved|achievement|achievements|contribute|contributed|contribution|role|built|build|implemented|implement|accomplish|accomplished|outcome|outcomes|result|results)\b/.test(value)) return 'contribution';
  return 'overview';
}

const followupWords = new Set(`and also please so okay ok is are does do did can i you your it its this that the app application project a an to for of in on with from me tell show give explain what where which how much have has was were really completely totally any there about
free paid price pricing cost costs pay payment subscription purchases purchase charge charges fee fees money monthly yearly download use source code repository repo github demo live try visit link store downloadable architecture backend connected connect integration integrated technology technologies stack tools language languages java react swiftui swift firebase weather data status finished complete completed production released published users impact accurate accuracy measurements verified problem purpose solve idea why learn learned learning lesson lessons challenge challenges achieve achieved achievement achievements contribute contributed contribution role built build implemented implement accomplish accomplished outcome outcomes result results`.split(/\s+/));

function isProjectFollowup(value, topic) {
  if (topic === 'overview' || !value.split(' ').every((word) => followupWords.has(word))) return false;
  return /\b(?:it|its|this|that|your app|your project|the app|the project|the price|the cost|the source|the demo|the stack|the backend|the status)\b/.test(value)
    || /^(?:free|paid|price|pricing|cost|how much|demo|source|code|repository|repo|technology|technologies|stack|status|architecture|backend|contribution|achievements)$/.test(value)
    || /^(?:(?:and|also|please) )*(?:show|give|tell|explain)(?: me)?(?: the)? (?:demo|source|code|repository|technology|technologies|stack|status|architecture|backend|contribution|price|pricing|cost)$/.test(value);
}

/** Returns an informational intent only. Clear and other UI actions stay in the command resolver. */
export function resolveTerminalQuestion(input, context = null) {
  const value = normalizeQuestion(input);
  if (!value || unsupported.test(value)) return null;
  const projectMatches = projects.filter((project) => new RegExp(`\\b${project.id === 'carbon-footprint' ? 'carbon(?: footprint)?' : project.id}\\b`).test(value));
  const hasCue = questionCue.test(value);
  const bareProject = projectMatches.length === 1 && /^(?:carbon(?: footprint)?|pitstop|wyndra|glassora)(?: app| project)?$/.test(value);
  const topic = projectTopic(value);
  if (projectMatches.length && (hasCue || bareProject || topic === 'pricing')) {
    if (projectMatches.length > 1 && /\b(?:backend|connected|share|shared|same server)\b/.test(value)) return { kind: 'command', command: 'arch' };
    if (projectMatches.length > 1) return { kind: 'clarify', choices: projectMatches.map((project) => project.title) };
    const project = projectMatches[0];
    return { kind: 'project', projectId: project.id, topic };
  }
  if (!projectMatches.length && isProjectFollowup(value, topic)) {
    const project = projects.find((item) => item.id === context?.projectId);
    return project ? { kind: 'project', projectId: project.id, topic } : { kind: 'clarify', reason: 'project-required', choices: projects.map((item) => item.title) };
  }
  if (/\bdownload\b/.test(value)) return null;
  if (!hasCue) return null;

  const daily = /\b(?:daily|routine|typical day|every day|day to day)\b/.test(value);
  const learning = learningCue.test(value);
  const building = (currentCue.test(value) && buildingCue.test(value)) || /\b(?:what are you (?:building|developing)|where do you work|where are you working)\b/.test(value);
  if (Number(daily) + Number(learning && currentCue.test(value)) + Number(building) > 1) {
    return { kind: 'clarify', choices: ['daily routine', 'current learning', 'current work'] };
  }
  if (daily) return { kind: 'profile', topic: 'routine' };
  if (learning && (currentCue.test(value) || /\b(?:study|studies|studying|college|university|degree|education|student|course|what are you learning)\b/.test(value))) return { kind: 'profile', topic: 'learning' };
  if (building) return { kind: 'profile', topic: 'current-work' };

  const skills = skillTopics.filter((topic) => mentions(value, topic.pattern));
  if (skills.length && /\b(?:level|experience|experienced|skill|skills|know|knowledge|proficient|proficiency|good|expert|beginner|intermediate|advanced|development|develop|developer|use|used|work|working|build|built|strong|strength|rate|rating|years|java|react|swiftui)\b/.test(value)) {
    // JavaScript is a web skill; it must never match Java as a substring.
    if (new Set(skills.map((skill) => skill.group)).size > 1) return { kind: 'clarify', choices: skills.map((skill) => skill.label) };
    return { kind: 'skill', skillId: skills[0].id };
  }

  const intents = [];
  if (/\b(?:name|yourself|background|bio|who are you|about you|about yourself|what do you do)\b/.test(value)) intents.push('about');
  if (/\b(?:skills|skill|tech stack|technologies|superpowers)\b/.test(value)) intents.push('skills');
  if (/\b(?:projects|project|portfolio work|built)\b/.test(value)) intents.push('projects');
  if (/\b(?:story|interests|hobbies|hobby|motivation|inspiration)\b/.test(value)) intents.push('story');
  if (/\b(?:open source|opensource|contributions|merged|pull requests|oss)\b/.test(value)) intents.push('oss');
  if (/\b(?:internship|internships|experience|employment|worked)\b/.test(value)) intents.push('exp');
  if (/\b(?:certificates|certificate|certifications|certification|credentials|badges|badge)\b/.test(value)) intents.push('certs');
  if (/\b(?:architecture|terminal work|terminal works|terminal local|use ai|using ai|ai service|send questions)\b/.test(value)) intents.push('arch');
  if (/\b(?:contact|email|linkedin|github|reach you|hire you|connect with you)\b/.test(value)) intents.push('contact');
  if (/\b(?:shortcuts|shortcut|keyboard|mac|windows|keys)\b/.test(value)) intents.push('shortcuts');
  if (/\b(?:help|commands|command list)\b/.test(value)) intents.push('help');
  const unique = [...new Set(intents)];
  if (unique.length > 1) return { kind: 'clarify', choices: unique };
  return unique.length ? { kind: 'command', command: unique[0] } : null;
}

export function getTerminalQuestionAnswer(result) {
  if (result.kind === 'clarify' && result.reason === 'project-required') return `Which project do you mean: ${result.choices.join(', ')}? Name one first, then ask a follow-up such as “Is it free?”`;
  if (result.kind === 'clarify') return `I found more than one topic: ${result.choices.join(', ')}. Please ask about one at a time; for example, “What did you build in Carbon Footprint?”`;
  if (result.kind === 'profile') {
    if (result.topic === 'routine') return `My portfolio does not specify a daily routine or schedule. What it does show is a hands-on approach: ${portfolio.reflection}\n\nTry “What did you build in Carbon Footprint?” or “What is your iOS development level?”`;
    if (result.topic === 'learning') return `My portfolio does not specify a current course or study schedule. My résumé lists ${portfolio.education.qualification} at ${portfolio.education.institution} (${portfolio.education.period}). That dated record does not establish current enrollment.\nRésumé: ${portfolio.education.source}\n\nMy stated learning interests are Java, Spring Boot, React, and native iOS interfaces with SwiftUI.\n\n${portfolio.reflection}\n\nTry “skills” for the tools listed in my portfolio.`;
    return 'A current in-progress project or employer is not specified in my portfolio. The documented projects are PitStop, Carbon Footprint, Wyndra, and Glassora; their listed statuses do not establish what I am building today.\n\nTry “projects” for their current portfolio descriptions, or “exp” for dated internship experience.';
  }
  if (result.kind === 'skill') {
    const topic = skillTopics.find((item) => item.id === result.skillId);
    const group = skillGroups[topic.group];
    const evidence = topic.projects.map((id) => projects.find((project) => project.id === id));
    return `${topic.label} — portfolio evidence\n${group.title}: ${group.skills.join(', ')}\n\n${evidence.map((project) => `${project.title}: ${project.contribution}\nTechnology: ${project.technologies.join(' / ')}\nCase study: ${project.link}`).join('\n\n')}\n\nI describe my experience through this work. My portfolio does not provide a verified proficiency rating, years of experience, or a beginner/intermediate/expert assessment. Listed group tools are not proof that every tool is used in each project.`;
  }
  const project = projects.find((item) => item.id === result.projectId);
  const header = `${project.title} · ${project.status}`;
  const caseStudy = `Case study: ${project.link}`;
  if (result.topic === 'pricing') return project.pricing
    ? `${project.title} is listed as ${project.pricing.download} to download on the ${project.pricing.storefront} (checked ${project.pricing.checkedAt}). Check the listing for the latest regional pricing and any purchase terms.\nApp Store: ${project.pricing.source}`
    : `Pricing for ${project.title} is not recorded in this portfolio, so I can’t confirm whether it is free or paid.\n${project.demo ? `${project.demoLabel}: ${project.demo}\n` : ''}${caseStudy}`;
  if (result.topic === 'source') return `${header}\n${project.source ? `Source: ${project.source}` : 'A public source link for this case-study implementation is not listed.'}${project.relatedSource ? `\n${project.relatedSourceLabel}: ${project.relatedSource}\n${project.scope}` : ''}\n${caseStudy}`;
  if (result.topic === 'demo') return `${header}\n${project.demo ? `${project.demoLabel}: ${project.demo}` : 'A public live demo or store link is not listed for this case study.'}\n\n${project.scope}\n${caseStudy}`;
  if (result.topic === 'technology' || result.topic === 'architecture') return `${header}\nTechnology: ${project.technologies.join(' / ')}\n\n${project.scope}\n${caseStudy}`;
  if (result.topic === 'status') return `${header}\n${project.scope}\nNo verified user counts or measured impact are recorded in this portfolio.\n${caseStudy}`;
  if (result.topic === 'learning') return `${header}\nThe documented work: ${project.contribution}\n${project.scope}\n\nA separate personal lesson or challenge for this project is not recorded in the terminal's portfolio data. Try “story” for my stated learning approach.\n${caseStudy}`;
  return `${header}\n${project.description}\n\nMy contribution: ${project.contribution}\nTechnology: ${project.technologies.join(' / ')}\n\n${project.scope}\n${caseStudy}`;
}
