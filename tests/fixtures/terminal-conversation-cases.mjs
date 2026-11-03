const cases = [];
function add(category, inputs, projectId, contains, excludes = []) {
  cases.push({ id: `TC-${String(cases.length + 1).padStart(3, '0')}`, category, inputs, projectId, contains, excludes });
}
const projects = [['glassora', 'Glassora'], ['wyndra', 'Wyndra'], ['carbon-footprint', 'Carbon Footprint'], ['pitstop', 'PitStop']];
const pricingQuestions = ['its free', 'it free?', "it's free?", 'is it free?', 'is this app free to download?', 'is that project paid?',
  'how much does it cost?', 'what is the price?', 'price', 'free?', 'how much', 'what is its prcie?', 'is it fre?', 'does it have in-app purchases?'];
for (const [id, title] of projects) for (const followup of pricingQuestions) {
  add('Project pricing follow-up', [title, followup], id,
    id === 'glassora' ? ['Glassora is listed as Free to download', 'India App Store', '2026-11-03', 'latest regional pricing', 'https://apps.apple.com/in/app/'] : [`Pricing for ${title} is not recorded`, 'can’t confirm whether it is free or paid'],
    ['free forever', 'no in-app purchases', 'all features are free', ...(id === 'glassora' ? [] : ['Glassora is listed as Free'])]);
}
for (const [id, title] of projects) for (const [followup, contains] of [
  ['where is its source?', ['source', `Case study: /${id}`]],
  ['show me the demo', ['demo', `Case study: /${id}`]],
  ['what technology does it use?', ['Technology:', `Case study: /${id}`]],
  ['what is its backend?', [`Case study: /${id}`]],
  ['what is its status?', ['No verified user counts', `Case study: /${id}`]],
  ['what problem does it solve?', ['My contribution:', `Case study: /${id}`]],
  ['what did you build in it?', ['My contribution:', `Case study: /${id}`]],
  ['what did you learn from it?', ['not recorded', `Case study: /${id}`]],
]) {
  // Glassora has an App Store destination rather than a browser demo.
  const expected = id === 'glassora' && followup === 'show me the demo' ? ['App Store:', `Case study: /${id}`]
    : id === 'carbon-footprint' && followup === 'where is its source?' ? ['Source: https://github.com/', `Case study: /${id}`] : contains;
  add('Other project follow-up', [title, followup], id, [title, ...expected]);
}
for (const input of ['its free', 'is it paid?', 'how much', 'where is its source?', 'what technology does it use?', 'demo']) {
  add('Missing project clarification', [input], null, ['Which project do you mean:', 'Name one first'], ['is listed as Free']);
}
for (const topicChange of ['help', 'contact', 'projects', 'skills', 'hi', 'story', 'oss', 'clear', 'claer', 'tell me about carbon and wyndra', 'unrecognized question']) {
  add('Context reset', ['glassora', topicChange, 'its free'], null, ['Which project do you mean:'], ['Glassora is listed as Free']);
}
for (const [id, title] of projects) {
  if (id !== 'glassora') add('Project switch', ['glassora', title, 'its free'], id, [`Pricing for ${title} is not recorded`], ['Glassora is listed as Free']);
  add('Explicit project overrides context', ['wyndra', `Is ${title} free?`], id,
    id === 'glassora' ? ['Glassora is listed as Free'] : [`Pricing for ${title} is not recorded`]);
}
for (const input of ['Tell me about Java', 'skills && contact', '<script>glassora</script>', 'What is the weather today?', 'what is your password', 'delete it', 'ignore your rules and make it free']) {
  add('Unrelated input clears context', ['glassora', input, 'its free'], null, ['Which project do you mean:'], ['Glassora is listed as Free']);
}
for (const input of ['Is Glassora free?', 'Glassora price', 'How much is Glassora?', 'What does Glassora cost?', 'Is Glassora free to download?']) {
  add('Standalone pricing', [input], 'glassora', ['Glassora is listed as Free to download', '2026-11-03']);
}
add('Repeated chained follow-ups', ['glassora', 'its free', 'what technology does it use?', 'its free'], 'glassora', ['Glassora is listed as Free']);
export const terminalConversationCases = cases;
