import { validateContactNote } from './contactDraft.js';

export function resolveBookingUrl(value) {
  if (!value?.trim()) return null;
  const url = new URL(value.trim());
  if (/[\u0000-\u0020\u007f]/.test(value.trim()) || url.protocol !== 'https:' || url.username || url.password || url.port || url.search || url.hash || !['cal.com', 'www.cal.com', 'calendly.com', 'www.calendly.com'].includes(url.hostname) || !/^\/[\w.-]+\/[\w./-]+\/?$/.test(url.pathname)) throw new Error('Use your public Cal.com or Calendly event URL.');
  return url.href;
}

export function resolveContactEndpoint(value) {
  if (!value?.trim()) return null;
  const url = new URL(value.trim());
  if (/[\u0000-\u0020\u007f]/.test(value.trim()) || url.origin !== 'https://formspree.io' || url.username || url.password || url.search || url.hash || !/^\/f\/[a-zA-Z0-9]{6,64}$/.test(url.pathname)) throw new Error('Use the public endpoint from your Formspree form.');
  return url.href;
}

// An HTTP 200 from a static-hosting SPA fallback is not proof of delivery.
export async function deliverContactNote({ recipient, email, note, endpoint }, { fetchImpl = globalThis.fetch, signal, timeoutMs = 10000 } = {}) {
  const fields = validateContactNote({ recipient, email, note });
  const target = resolveContactEndpoint(endpoint);
  if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
  if (!target) throw new Error('Direct sending is not connected yet. Please use the email link above.');
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal?.addEventListener('abort', cancel, { once: true });
  const timer = setTimeout(cancel, timeoutMs);
  try {
    const response = await fetchImpl(target, {
      method: 'POST', credentials: 'omit', redirect: 'error', signal: controller.signal,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: fields.email, message: fields.note, _subject: 'New note from your portfolio' }),
    });
    if (!response.ok || !response.headers.get('content-type')?.toLowerCase().includes('application/json')) throw new Error('Unconfirmed response');
    const result = await response.json();
    const acknowledged = result && typeof result === 'object' && !Array.isArray(result) && result.ok !== false && !result.error && (!result.errors || (Array.isArray(result.errors) && result.errors.length === 0));
    if (!acknowledged) throw new Error('Unconfirmed response');
    return { mode: 'submitted' };
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error('Delivery could not be confirmed. Your note is still here. Please try again.');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
  }
}
