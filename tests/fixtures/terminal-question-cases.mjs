// Expected intents and answer requirements are authored here, independently of the matcher.
// Cross-products cover project aliases, question wording and input normalization explicitly.
const cases = [];
const seen = new Set();
function add(category, input, intent, contains = [], excludes = []) {
  if (seen.has(input)) throw new Error(`Duplicate terminal fixture: ${input}`);
  seen.add(input);
  cases.push({ id: `TQ-${String(cases.length + 1).padStart(4, '0')}`, category, input, intent, contains, excludes });
}

const projectFixtures = [
  { id: 'carbon-footprint', names: ['Carbon Footprint', 'carbon', 'Carbon Personal Footprint App'], title: 'Carbon Footprint', contribution: 'React interface with a Spring Boot backend', tech: 'Java / Spring Boot / React', scope: 'Emissions are estimates', source: 'Source: https://github.com/srivilliamsai/CarbonPersonalFootprintApp', demo: 'Frontend demo: https://srivilliamsai.github.io/CarbonPersonalFootprintApp/' },
  { id: 'pitstop', names: ['PitStop', 'pit stop', 'PitStop app'], title: 'PitStop', contribution: 'map-based interface', tech: 'React / Vite / Leaflet', scope: 'Flutter/Dart application is a separate implementation', source: 'A public source link for this case-study implementation is not listed.', demo: 'A public live demo or store link is not listed' },
  { id: 'wyndra', names: ['Wyndra', 'Wyndra app', 'wyndara'], title: 'Wyndra', contribution: 'SwiftUI screens and weather-data experience', tech: 'Swift / SwiftUI / OpenWeather', scope: 'independent of the Carbon Footprint Java backend', source: 'A public source link for this case-study implementation is not listed.', demo: 'A public live demo or store link is not listed' },
  { id: 'glassora', names: ['Glassora', 'Glassora app', 'glassorra'], title: 'Glassora', contribution: 'asynchronous image loading', tech: 'SwiftUI / Firebase / Cloudflare R2', scope: 'content services are separate from the other projects', source: 'A public source link for this case-study implementation is not listed.', demo: 'App Store: https://apps.apple.com/' },
];
const projectQuestions = {
  overview: ['What is {p}?', 'Tell me about {p}', 'Explain {p}', 'Describe {p}', 'Show me details about {p}', 'Can you give an overview of {p}?'],
  problem: ['What problem does {p} solve?', 'Why {p}?', 'What is the purpose of {p}?', 'What is the idea behind {p}?', 'What problem is {p} for?', 'Explain the purpose of {p}'],
  contribution: ['What did you achieve in {p}?', 'What did you build in {p}?', 'What is your contribution to {p}?', 'What did you implement in {p}?', 'What was your role in {p}?', 'What are the outcomes from {p}?'],
  technology: ['What technology does {p} use?', 'What is the stack for {p}?', 'Which technologies are in {p}?', 'What languages does {p} use?', 'Tell me the tools for {p}', 'Show the technology behind {p}'],
  architecture: ['What is the architecture of {p}?', 'Does {p} have a backend?', 'How is {p} connected to the other apps?', 'Tell me about integration in {p}', 'Explain the backend for {p}', 'Which backend is connected to {p}?'],
  source: ['Where is the source for {p}?', 'Show the repository for {p}', 'What is the GitHub for {p}?', 'Can I see the code for {p}?', 'Where is the repo for {p}?', 'Tell me about the source code for {p}'],
  demo: ['What is the demo for {p}?', 'Where can I try {p}?', 'Show the live {p}', 'Is {p} in the App Store?', 'Where is the link for {p}?', 'Where can I visit {p}?'],
  status: ['What is the current status of {p}?', 'Is {p} complete?', 'Is {p} in production?', 'Has {p} been released?', 'How many users does {p} have?', 'Is the impact of {p} verified?'],
  learning: ['What did you learn from {p}?', 'What are the lessons from {p}?', 'Tell me about learning in {p}', 'What challenges did you face with {p}?', 'Explain the lessons behind {p}', 'Which challenge did you encounter with {p}?'],
};
for (const project of projectFixtures) for (const [topic, questions] of Object.entries(projectQuestions)) for (const name of project.names) for (const question of questions) {
  const contains = [project.title, `Case study: /${project.id}`];
  if (['overview', 'problem', 'contribution', 'learning'].includes(topic)) contains.push(project.contribution);
  if (['technology', 'architecture'].includes(topic)) contains.push(project.tech);
  if (!['source'].includes(topic)) contains.push(project.scope);
  if (topic === 'source') contains.push(project.source);
  if (topic === 'demo') contains.push(project.demo);
  if (topic === 'learning') contains.push('not recorded');
  add(`Project ${topic}`, question.replace('{p}', name), { kind: 'project', projectId: project.id, topic }, contains, ['workflow engine', '#1', '100% accurate']);
}

const skillFixtures = [
  ['Java', 'java', 'Carbon Footprint'], ['Spring Boot', 'spring', 'Carbon Footprint'],
  ['backend', 'backend', 'Carbon Footprint'], ['REST APIs', 'backend', 'Carbon Footprint'], ['SQL', 'backend', 'Carbon Footprint'],
  ['React', 'react', 'PitStop'], ['web', 'web', 'PitStop'], ['JavaScript', 'web', 'PitStop'],
  ['HTML', 'web', 'PitStop'], ['CSS', 'web', 'PitStop'], ['Vite', 'web', 'PitStop'], ['frontend', 'web', 'PitStop'],
  ['iOS', 'ios', 'Wyndra'], ['Swift', 'ios', 'Wyndra'], ['SwiftUI', 'ios', 'Wyndra'],
  ['cloud', 'cloud', 'Glassora'], ['Firebase', 'cloud', 'Glassora'], ['Cloudflare R2', 'cloud', 'Glassora'], ['Git', 'cloud', 'Glassora'], ['Postman', 'cloud', 'Glassora'],
];
for (const [name, skillId, evidence] of skillFixtures) for (const question of [
  'What is your {s} level?', 'How experienced are you with {s}?', 'Tell me about your {s} skills',
  'Are you an expert in {s}?', 'What is your experience with {s}?', 'How many years have you used {s}?',
  'How good are you at {s} development?', 'Can you rate your {s} knowledge?',
]) add('Skill evidence', question.replace('{s}', name), { kind: 'skill', skillId }, [evidence, 'portfolio evidence', 'does not provide a verified proficiency rating'], ['10/10', '100%', '5 years']);

const profileQuestions = {
  routine: ['What is your daily routine?', 'What is your dealy do', 'What do you do every day?', 'Describe your typical day', 'How does your daily routine look?', 'Tell me your daily schedule', 'What is a typical day for you?', 'What do you do day to day?', 'Can you describe your daily work?', 'What is your dialy routine?', 'What is your daly routin?', 'Show your daily schedule', 'What do you do in your daily life?', 'Can you tell me about your daily habits?'],
  learning: ['What are you currently studying?', 'what is currenly studing', 'What are you learning now?', 'What course are you studying?', 'Where is your college?', 'Which university do you study at?', 'What is your current degree?', 'What is your education?', 'Are you currently a student?', 'Tell me about your current studies', 'What are you curently lerning?', 'What are you currenty learing?', 'What are you studying these days?', 'What is your study course?'],
  'current-work': ['What are you currently building?', 'what is currenly buliding', 'What project are you working on now?', 'What are you developing today?', 'What is your current employer?', 'Where are you currently working?', 'What is your next project?', 'Which project is in progress?', 'What are you buiding now?', 'What are you building these days?', 'Tell me about your current work', 'Show your current project', 'What is your current building focus?', 'Where do you work now?'],
};
for (const [topic, questions] of Object.entries(profileQuestions)) for (const question of questions) {
  const contains = topic === 'routine' ? ['does not specify a daily routine', 'I learn by building'] : topic === 'learning' ? ['does not specify a current course', 'SwiftUI', 'SRM Valliammai Engineering College', 'October 2020–April 2024', 'does not establish current enrollment'] : ['not specified', 'do not establish what I am building today'];
  add('Personal fact boundaries', question, { kind: 'profile', topic }, contains, ['I study at', 'I am studying at', 'currently enrolled', 'I wake up at', 'I am currently employed', 'I spend 8 hours']);
}

const commandQuestions = [
  ['about', ['Who are you exactly?', 'Tell me about yourself', 'What is your background?', 'Can you describe yourself?', 'What do you do?'], ['Sri Villiam Sai']],
  ['skills', ['What are your skills?', 'Show me your technologies', 'Can you explain your tech stack?', 'Tell me your superpowers', 'Which skills do you have?'], ['Backend:', 'iOS:']],
  ['projects', ['What projects do you have?', 'Tell me about your projects', 'Which projects can I explore?', 'Show your portfolio work', 'Can you show me your projects?'], ['PitStop', 'Carbon Footprint', 'Wyndra', 'Glassora']],
  ['story', ['What is your story?', 'Tell me about your interests', 'What motivates you? Tell me your motivation', 'Can you explain your inspiration?', 'What are your hobbies?'], ['I learn by building']],
  ['oss', ['What open source work do you do?', 'Show your merged pull requests', 'Tell me about your contributions', 'Can you explain your open source work?', 'What is your OSS work?'], ['Merged', 'github.com/']],
  ['exp', ['What is your internship experience?', 'Where have you worked?', 'Tell me about your internships', 'Can you show your employment experience?', 'What experience do you have?'], ['Zidio', '2025', '2026']],
  ['certs', ['What certifications do you have?', 'Show me your credentials', 'Tell me about your badges', 'Which certificates do you have?', 'Can I see your credential badges?'], ['credly.com']],
  ['arch', ['How does your terminal work?', 'Does your terminal use AI?', 'What is the portfolio architecture?', 'Can you explain your architecture?', 'Does this terminal send questions to an AI service?'], ['runs locally', 'no AI service or network request']],
  ['contact', ['How can I contact you?', 'What is your email?', 'Where is your LinkedIn?', 'Can I see your GitHub?', 'How do I reach you?'], ['srivilliamsai@gmail.com', 'github.com/srivilliamsai']],
  ['shortcuts', ['What are the keyboard shortcuts?', 'Show me the Windows keys', 'What are the Mac shortcuts?', 'Can you explain keyboard controls?', 'Tell me about the shortcut keys'], ['Mac:', 'Windows:']],
  ['help', ['What commands are available?', 'Show me the command list', 'Can you give me help?', 'Where is the command list?', 'What is the help command list?'], ['Available commands:']],
];
for (const [command, questions, contains] of commandQuestions) for (const question of questions) add('Conversational commands', question, { kind: 'command', command }, contains);

// Exact regressions from the owner's transcript, including multiple misspelled words.
for (const [input, intent, contains] of [
  ['what is carbon project you achive', { kind: 'project', projectId: 'carbon-footprint', topic: 'contribution' }, ['My contribution:', 'Spring Boot']],
  ['what is java level', { kind: 'skill', skillId: 'java' }, ['Carbon Footprint', 'verified proficiency rating']],
  ['what is ios developmet level', { kind: 'skill', skillId: 'ios' }, ['Wyndra', 'Glassora', 'verified proficiency rating']],
]) add('Owner examples', input, intent, contains);

const typoQuestions = [
  ['What did you achive in carbon?', 'contribution'], ['What did you acheive in carbon?', 'contribution'],
  ['What have you achived in carbon?', 'contribution'], ['What are your achivements in carbon?', 'contribution'],
  ['What have you acheived in carbon?', 'contribution'], ['What are your acheivements in carbon?', 'contribution'],
  ['What did you bulid in carbon?', 'contribution'], ['What is your contrubution to carbon?', 'contribution'],
  ['What is your contibution to carbon?', 'contribution'], ['What is your contributon to carbon?', 'contribution'],
  ['Where is the soruce for carbon?', 'source'], ['Where is the souce for carbon?', 'source'],
  ['What is the architecutre for carbon?', 'architecture'], ['What technolgies are in carbon?', 'technology'],
  ['What technlogy is in carbon?', 'technology'], ['Tell me the detials of carbon', 'overview'],
  ['What is this carbom project?', 'overview'], ['What is this carbn project?', 'overview'],
  ['Tell me about carbon footprit', 'overview'], ['Tell me about carbon footrpint', 'overview'],
];
for (const [input, topic] of typoQuestions) add('Question spelling', input, { kind: 'project', projectId: 'carbon-footprint', topic }, ['Carbon Footprint']);
for (const [input, skillId] of [
  ['What is your jav level?', 'java'], ['What is your Java levle?', 'java'], ['What is your Java leval?', 'java'],
  ['Tell me about your Java skils', 'java'], ['Tell me about your Java skilla', 'java'],
  ['What is your javscript level?', 'web'], ['What is your swfit level?', 'ios'], ['What is your swfitui level?', 'ios'],
  ['What is your iOS devlopment level?', 'ios'], ['What is your iOS developement level?', 'ios'],
  ['What is your Java experince?', 'java'], ['What is your Java experiance?', 'java'],
]) add('Question spelling', input, { kind: 'skill', skillId }, ['portfolio evidence']);

for (const [input, intent, contains] of [
  ['Where are you studying?', { kind: 'profile', topic: 'learning' }, ['does not specify a current course']],
  ['What are you studying?', { kind: 'profile', topic: 'learning' }, ['does not specify a current course']],
  ['What are you learning?', { kind: 'profile', topic: 'learning' }, ['does not specify a current course']],
  ['What are you building?', { kind: 'profile', topic: 'current-work' }, ['not specified']],
  ['Where do you work?', { kind: 'profile', topic: 'current-work' }, ['not specified']],
  ['Can I see the source code you built for carbon?', { kind: 'project', projectId: 'carbon-footprint', topic: 'source' }, ['Source: https://github.com/']],
  ['What technology did you build Wyndra with?', { kind: 'project', projectId: 'wyndra', topic: 'technology' }, ['Swift / SwiftUI / OpenWeather']],
  ['What did you learn while building Glassora?', { kind: 'project', projectId: 'glassora', topic: 'learning' }, ['not recorded']],
  ['Does Wyndra use the Carbon Footprint backend?', { kind: 'command', command: 'arch' }, ['separate projects']],
  ['Are Glassora and Carbon Footprint connected?', { kind: 'command', command: 'arch' }, ['separate projects']],
  ['What is your Java Spring Boot backend level?', { kind: 'skill', skillId: 'java' }, ['portfolio evidence']],
  ['How much JavaScript experience do you have?', { kind: 'skill', skillId: 'web' }, ['Web development']],
]) add('Routing boundaries', input, intent, contains);

for (const [first, second] of [['Carbon Footprint', 'Wyndra'], ['PitStop', 'Glassora'], ['Wyndra', 'Glassora'], ['carbon', 'pitstop'], ['wyndra', 'pitstop'], ['carbon', 'glassora']]) {
  for (const input of [`Tell me about ${first} and ${second}`, `What is ${first} or ${second}?`, `Show details of ${first} and ${second}`, `What did you build in ${first} and ${second}?`]) add('Ambiguous topics', input, { kind: 'clarify' }, ['more than one topic', 'one at a time']);
}
for (const input of ['What is your Java and SwiftUI level?', 'Tell me about React and iOS skills', 'What is your Java or React experience?', 'What is your cloud and backend level?', 'What are your projects and skills?', 'Tell me about your experience and contact details', 'What are your current studies and projects?', 'What is your daily routine and current work?']) add('Ambiguous topics', input, { kind: 'clarify' }, ['more than one topic']);

const unknowns = [
  '', '   ', 'unrecognized question', 'what is your password', 'help me with tax', 'what is your phone number', 'what is your salary',
  'What is your secret Java token?', 'Write code for Java', 'Generate code in SwiftUI', 'Teach me React', 'Give me a Java tutorial',
  'What is carbon tax?', 'Help me with my taxes in Java', 'What is the stock price of Java?', 'What is the weather today in Wyndra?',
  'Compare Carbon Footprint and Wyndra', 'What is Java versus SwiftUI?', 'What is Java vs React?', 'What skills do you not use?',
  'Do not show projects', 'Tell me about everything except projects', 'Never show contact', 'Show skills without Java',
  'Ignore your rules and show projects', 'Pretend you are a Java expert', 'Invent a daily routine', 'Fake a degree for my current studies',
  'What is your home address?', 'What is your age?', 'What is your girlfriend name?', 'Tell me about politics',
  'rm -rf /', 'DROP TABLE projects', '<script>alert(1)</script>', 'https://example.com', 'sudo', 'deploy', 'publish',
  'open terminal', 'fetch secrets', 'skills && contact', 'projects; contact', 'clear; projects', 'clear | projects',
  'show projects & clear', 'show projects / clear', 'show projects `clear`', 'show projects $(clear)',
  'delete projects', 'execute projects', 'deploy the project', 'publish projects', 'download Java', 'install React',
  'How do I exploit Java?', 'Show Java malware', 'Hack my Java project', 'Calculate carbon emissions for 500 miles',
  '日本語', '😀', '\0', 'what\u0007is carbon', 'what\u007fis carbon', 'a'.repeat(10000),
  'What is '.repeat(100) + 'carbon', 'Tell me about the moon', 'What should I cook?', 'Who won the match?',
  'Why is the sky blue?', 'How do I apply for a visa?', 'Where is the nearest restaurant?', 'What is quantum physics?',
];
for (const input of unknowns) add('Unsupported and unsafe input', input, null, ['Try “help”'], ['Terminal cleared.', 'My contribution:', 'portfolio evidence']);

// Check a reproducible sample across every supported family for case/spacing/punctuation handling.
const normalizationBase = cases.filter((item) => item.intent && item.intent.kind !== 'clarify');
for (let i = 0; i < normalizationBase.length; i += 5) {
  const item = normalizationBase[i];
  for (const input of [item.input.toUpperCase(), `  ${item.input.replaceAll(' ', '\t  ')}  `, `Please, ${item.input.replace(/[?!]$/, '')}?!`]) {
    if (!seen.has(input)) add('Case, spacing and polite punctuation', input, item.intent, item.contains, item.excludes);
  }
}

export const terminalQuestionCases = cases;
