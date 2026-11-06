import {displayOwnerName} from './assistantIdentity.js';

// Chat displays approved links and images separately from the spoken answer.
export function assistantText(value) {
  return displayOwnerName(String(value || '')
    .replace(/!\[[^\]\n]*\]\([^\n)]*\)/g, '')
    .replace(/\[([^\]\n]*)\]\((?:[^()\n]|\([^()\n]*\))*\)/g, (_match, label) => label.trim())
    .replace(/\*\*([^*\n]+)\*\*/g, '$1')
    .replace(/`([^`\n]+)`/g, '$1')
    .replace(/\n[ \t]+\n/g, '\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim());
}
