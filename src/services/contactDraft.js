const EMAIL = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;
const CONTROLS = /[\u0000-\u001f\u007f]/;

export function validateContactNote({ recipient, email, note }) {
  if (typeof recipient !== 'string' || recipient.length > 254 || !EMAIL.test(recipient) || CONTROLS.test(recipient) || /[?&#%]/.test(recipient)) throw new Error('Invalid contact address.');
  if (typeof email !== 'string' || email.length > 254 || CONTROLS.test(email) || !EMAIL.test(email.trim())) throw new Error('Enter a valid email address.');
  if (typeof note !== 'string' || !note.trim() || note.length > 1000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(note)) throw new Error('Write a note of up to 1,000 characters.');
  return { recipient, email: email.trim(), note: note.trim().replace(/\r\n?/g, '\n') };
}

// Keep all visitor input inside encoded query values, never mail headers or recipients.
export function createContactDraft(input) {
  const { recipient, email, note } = validateContactNote(input);
  const body = `From: ${email}\n\n${note}`;
  return `mailto:${recipient}?subject=${encodeURIComponent('Hello from your portfolio')}&body=${encodeURIComponent(body)}`;
}
