import {withOwnerName} from './assistantIdentity.js';
import { assistantMedia } from '../data/assistantMedia.js';
import { achievements } from '../data/achievements.js';

const achievementCovers = new Set(achievements.flatMap(item => [item.cardCover?.src, item.cover?.src]).filter(Boolean));
export const workGallery = assistantMedia.filter(media => media.group === 'work' && !media.id.startsWith('certificate:') && !media.src.includes('/projectcover/') && !achievementCovers.has(media.src)).slice(0, 30).map(withOwnerName);
export const personalGallery = assistantMedia.filter(media => media.group === 'personal' && !media.placeholder).map(withOwnerName);
export const galleryMedia = [...workGallery, ...personalGallery];
const pending = new Map();

export function preloadGalleryImage(src, environment = globalThis) {
  if (!environment.Image) return Promise.resolve(false);
  if (pending.has(src)) return pending.get(src);
  const ready = new Promise(resolve => {
    const image = new environment.Image();
    image.onload = () => resolve(true);
    image.onerror = () => { pending.delete(src); resolve(false); };
    image.src = src;
  });
  pending.set(src, ready);
  return ready;
}
export function preloadAssistantGallery() {
  return Promise.all([...galleryMedia.map(media => preloadGalleryImage(media.thumbnail || media.src)), preloadGalleryImage('/static/media/assistant/vill-robot-body.webp')]);
}
