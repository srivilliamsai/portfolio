// Public upstream merge evidence verified on 2 November 2026.
export const contributionsVerifiedOn = '2026-11-02';
export const contributions = [
  { number: 22, title: 'Accessibility passport', mergedAt: '2026-10-28', tags: ['Workday Extend', 'Accessibility'],
    problem: 'Provide an example for requesting and tracking workplace adjustments.',
    contribution: 'Contributed the app model, security domain, pages, Home Card and sample data to the developer catalog.' },
  { number: 17, title: 'Developer agent skills', mergedAt: '2026-10-01', tags: ['Agent skills', 'Developer tools'],
    problem: 'Give coding agents guidance tied to Workday development artifacts.',
    contribution: 'Contributed eight skill/example sets covering Extend, orchestration, APIs, AI Gateway and related development workflows.' },
  { number: 14, title: 'Milestone celebrations', mergedAt: '2026-09-16', tags: ['WQL', 'Orchestration'],
    problem: 'Show how milestone data can feed an anniversary-celebration workflow.',
    contribution: 'Contributed WQL queries, an orchestration example and sample webhook payloads.' },
  { number: 16, title: 'Peer kudos & recognition', mergedAt: '2026-09-21', tags: ['Home Cards', 'Workday Extend'],
    problem: 'Demonstrate a peer-recognition flow in an Extend example.',
    contribution: 'Contributed the data model, security domain, Home Card, presentation pages and notification orchestration.' },
  { number: 5, title: 'PTO & leave policy skill', mergedAt: '2026-08-24', tags: ['Agent skills', 'Documentation'],
    problem: 'Provide a focused agent-skill example for leave-policy questions.',
    contribution: 'Contributed a skill definition, supporting README, example metadata and catalog update.' },
].map((item) => ({ ...item, status: 'Merged', repository: 'Workday/WorkdayDeveloperProgram',
  url: `https://github.com/Workday/WorkdayDeveloperProgram/pull/${item.number}` }));
