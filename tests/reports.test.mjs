import test from 'node:test';
import assert from 'node:assert/strict';
import { printableReportText } from '../scripts/lib/report-text.mjs';

test('JUnit invalid-input names retain visible control-character notation', () => {
  const xml = '<testcase name="input: \u0000 what\u0007is carbon"/>';
  assert.equal(printableReportText(xml), '<testcase name="input: \\u0000 what\\u0007is carbon"/>');
});
test('report sanitization covers all forbidden XML 1.0 BMP characters', () => {
  const codes = [...Array.from({ length: 32 }, (_, code) => code).filter((code) => ![9, 10, 13].includes(code)), 0xfffe, 0xffff];
  for (const code of codes) {
    assert.equal(printableReportText(String.fromCharCode(code)), `\\u${code.toString(16).padStart(4, '0')}`);
  }
});
test('report sanitization preserves valid Unicode, whitespace and existing XML escapes', () => {
  const text = '<testcase name="日本語 😀 &amp; &quot;input&quot;"/>\r\n\t';
  assert.equal(printableReportText(text), text);
  assert.equal(printableReportText(printableReportText('\u0000')), '\\u0000');
});
