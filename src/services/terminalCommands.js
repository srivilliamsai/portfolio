import { projects } from '../data/projects.js';
import { portfolio, skillGroups } from '../data/portfolio.js';
import { contributions } from '../data/contributions.js';
import { terminalShortcuts } from './terminalKeyboard.js';
import { resolveTerminalQuestion, getTerminalQuestionAnswer } from './terminalQuestions.js';

export const terminalWelcome = `Welcome to Sri Villiam Sai's Interactive Dev Shell (zsh).
Type 'help' to see all available commands. Commands run locally in your browser.`;

const commandAliases = {
  help: ['help', '?', 'commands', 'command'],
  skills: ['skills', 'skill', 'stack', 'tech stack', 'technologies', 'technology', 'what is your tech stack'],
  projects: ['projects', 'project', 'show projects', 'what have you built'],
  about: ['about', 'bio', 'whoami', 'who are you', 'what is your name'],
  story: ['story', 'hobbies', 'hobby'],
  oss: ['oss', 'open source', 'opensource', 'contributions', 'contribution'],
  exp: ['exp', 'experience', 'internships', 'internship'],
  certs: ['certs', 'cert', 'certifications', 'certification', 'badges', 'badge'],
  arch: ['arch', 'architecture'],
  contact: ['contact', 'contacts', 'email', 'github', 'linkedin', 'hire', 'sudo hire'],
  hello: ['hi', 'hello', 'hey', 'thanks', 'thank you'],
  clear: ['clear'],
  shortcuts: ['shortcuts', 'shortcut', 'keys', 'keyboard'],
};
const aliases = Object.entries(commandAliases).flatMap(([command, names]) => names.map((alias) => ({ alias, command })));
const commandLookup = new Map(aliases.map(({ alias, command }) => [alias, command]));

export function getTerminalCompletions(input) {
  const prefix = String(input ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (!prefix) return [];
  return Object.entries(commandAliases).flatMap(([command, names]) => {
    const match = command.startsWith(prefix) ? command : names.find((alias) => alias.startsWith(prefix));
    return match ? [match] : [];
  }).sort();
}

function normalizeCommand(input) {
  const value = String(input ?? '').toLowerCase().trim();
  return value === '?' ? value : value.replace(/[?!.,;]/g, '').replace(/\s+/g, ' ');
}

// Count insertions, omissions, substitutions and adjacent swapped letters.
function spellingDistance(input, candidate) {
  const rows = Array.from({ length: input.length + 1 }, (_, index) => [index]);
  rows[0] = Array.from({ length: candidate.length + 1 }, (_, index) => index);
  for (let i = 1; i <= input.length; i += 1) {
    for (let j = 1; j <= candidate.length; j += 1) {
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + (input[i - 1] === candidate[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && input[i - 1] === candidate[j - 2] && input[i - 2] === candidate[j - 1]) {
        rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1);
      }
    }
  }
  return rows[input.length][candidate.length];
}

export function resolveTerminalCommand(input) {
  const value = normalizeCommand(input);
  if (commandLookup.has(value)) return { command: commandLookup.get(value), corrected: false, suggestions: [] };
  const unknown = { command: null, corrected: false, suggestions: [] };
  if (value.length < 2 || value.length > 64 || !/^[a-z]+(?: [a-z]+)*$/.test(value)) return unknown;
  // Sentence-level edit distance can turn “what is your age” into “what is your name”.
  // Questions use explicit local intents; only compact command names use fuzzy correction.
  if (/^(?:what|who|where|when|why|how|can|do|does|did|is|are|have|has|tell|show|explain|describe) /.test(value)) return unknown;

  let bestDistance = Infinity;
  const matches = new Set();
  for (const { alias, command } of aliases) {
    if (alias === '?') continue;
    const limit = Math.min(value.length, alias.length) >= 7 ? 2 : 1;
    if (Math.abs(value.length - alias.length) > limit) continue;
    const distance = spellingDistance(value, alias);
    if (distance > limit || distance > bestDistance) continue;
    if (distance < bestDistance) { matches.clear(); bestDistance = distance; }
    matches.add(command);
  }
  if (matches.size === 1) return { command: [...matches][0], corrected: true, suggestions: [] };
  return { ...unknown, suggestions: [...matches].sort().slice(0, 3) };
}

export function getTerminalReply(input, context = null) {
  const result = resolveTerminalCommand(input);
  if (!result.command) {
    const question = resolveTerminalQuestion(input, context);
    if (question) return {
      output: question.kind === 'command' ? getCommandResponse(question.command) : getTerminalQuestionAnswer(question),
      context: question.kind === 'project' ? { projectId: question.projectId } : null,
    };
    const suggestion = result.suggestions.length ? `Did you mean ${result.suggestions.map((command) => `“${command}”`).join(' or ')}?\n` : '';
    return { output: `${suggestion}I couldn’t match that portfolio question or command. Try “help”, “skills”, “projects”, or “contact”. You can also ask “What did you build in Carbon Footprint?”.`, context: null };
  }
  return { output: `${result.corrected ? `Corrected to “${result.command}”.\n\n` : ''}${getCommandResponse(result.command)}`, context: null };
}

export function getTerminalResponse(input, context = null) {
  return getTerminalReply(input, context).output;
}

function getCommandResponse(command) {
  if (command === 'help') {
    return `Available commands:
  about / bio       My background and interests
  skills            Tools I use, with project evidence
  projects          My web and iOS projects
  story             The thread between Java and SwiftUI
  oss               Merged open-source contributions
  exp / experience  Internship experience
  certs / badges    Public credential profile
  arch              How these projects fit together
  contact           Email, LinkedIn, and GitHub
  clear             Clear the terminal
  shortcuts / keys  Mac and Windows keyboard shortcuts

Try “projects” or “story” to explore my work and interests.
Singular names and small spelling mistakes work too. Unclear matches show suggestions.
You can also ask portfolio questions, for example:
  What did you achieve in Carbon Footprint?
  What is your Java level?
  What are you currently studying?
Questions use local topic matching, not general AI. Missing personal details are stated explicitly.
After naming a project, try “Is it free?”, “What technology does it use?” or “Where is its source?”. Changing topics or clearing output resets that project context.
This is a local portfolio guide, so it doesn’t send your questions to an AI service.`;
  }
  if (command === 'skills') {
    return skillGroups.map((group) => `${group.title}: ${group.skills.join(', ')}`).join('\n');
  }
  if (command === 'projects') {
    return projects.map((project) => `${project.title} · ${project.status}\n${project.description}\n${project.technologies.join(' / ')}${project.source ? `\nSource: ${project.source}` : ''}${project.demo ? `\n${project.demoLabel}: ${project.demo}` : ''}`).join('\n\n');
  }
  if (command === 'about') {
    return `${portfolio.name}\nSoftware developer working with Java, Spring Boot, React, and native iOS interfaces with SwiftUI.\n\n${portfolio.reflection}`;
  }
  if (command === 'story') return `${portfolio.reflection}\n\nCarbon Footprint explores Java and React together. Wyndra and Glassora explore native SwiftUI interfaces. These are separate applications: the iOS projects do not use Carbon Footprint’s Java backend.\n\nThis portfolio follows the same practical approach: its terminal works locally, with no AI account or network request. Try “projects”, “arch” or “oss” for the details.`;
  if (command === 'oss') return contributions.map((item) => `${item.title} · Merged ${item.mergedAt}\n${item.contribution}\n${item.url}`).join('\n\n');
  if (command === 'exp') return `Zidio Development · Java Full Stack Developer Intern\nJuly–September 2025 · Bangalore\nWorked with Java and Spring Boot on full-stack web applications.\n\nInfosys Springboard · Full Stack Trainee / Intern\nNovember 2025–January 2026 · Remote\nPracticed web interfaces, databases, and the software development lifecycle.`;
  if (command === 'certs') return `Explore my public credential profile for individual badge titles, issuers, and details:\n${portfolio.credentials}`;
  if (command === 'arch') return `These are separate projects:\n• Carbon Footprint: React interface and Spring Boot backend.\n• Wyndra: native SwiftUI weather app using weather data.\n• Glassora: native SwiftUI wallpaper app with cloud-backed content.\n• This portfolio: a static React/Vite application. Its interactive terminal runs locally in the browser, with no AI service or network request for answers.`;
  if (command === 'contact') return `Let’s connect:\nEmail: ${portfolio.email}\nLinkedIn: ${portfolio.linkedin}\nGitHub: ${portfolio.github}`;
  if (command === 'hello') return `Hello! I’m Sri’s local portfolio guide. Try “skills”, “projects”, or “story” to explore.`;
  if (command === 'clear') return 'Terminal cleared.';
  if (command === 'shortcuts') return `Keyboard shortcuts (while the page / terminal is focused):\n\n${terminalShortcuts.map((item) => `${item.action}\n  Mac: ${item.mac} · Windows: ${item.windows}`).join('\n\n')}\n\nTab completes a partial command; with empty input or an already complete command, it moves focus. Ctrl+C copies selected text; otherwise it cancels input. Use Ctrl+G if your browser reserves Ctrl+C. Other text-editing keys keep their normal browser behavior.`;
}
