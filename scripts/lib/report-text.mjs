// Invalid-input tests deliberately include control characters. XML 1.0 forbids
// these characters even inside quoted attributes; retain their visible notation.
export function printableReportText(text) {
  return text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g,
    (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`);
}
