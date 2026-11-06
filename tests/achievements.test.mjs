import test from 'node:test';
import assert from 'node:assert/strict';
import { achievements, achievementPath, getAchievement } from '../src/data/achievements.js';
import { canonicalPaths, pageRoutes } from '../src/app/routeCatalog.js';

test('every achievement can be resolved and reached through the canonical route catalog', () => {
  assert.equal(new Set(achievements.map((entry) => entry.slug)).size, achievements.length);
  assert.ok(pageRoutes.some((route) => route.path === 'achievements'));
  assert.ok(pageRoutes.some((route) => route.path === 'achievements/:slug'));
  for (const achievement of achievements) {
    assert.equal(getAchievement(achievement.slug), achievement);
    assert.ok(canonicalPaths.includes(achievementPath(achievement)));
  }
  for (const unknown of ['', undefined, 'missing-achievement', 'constructor', '__proto__']) {
    assert.equal(getAchievement(unknown), undefined);
    assert.ok(!canonicalPaths.includes('/achievements/' + unknown));
  }
});

test('achievement content and media stay local without exposing source folders or registration numbers', () => {
  const serialized = JSON.stringify(achievements);
  assert.doesNotMatch(serialized, /https?:\/\/|mailto:|\/Users\/|RA\d{8,}/i);
  for (const achievement of achievements) {
    assert.match(achievementPath(achievement), /^\/achievements\/[a-z0-9-]+$/);
    const cardCover = achievement.cardCover || achievement.cover;
    assert.match(cardCover.src, /^\/static\/media\/achievements\/[a-z0-9-]+\.(?:png|svg|webp|jpg)$/);
    assert.ok(cardCover.alt && cardCover.width > 0 && cardCover.height > 0);
    for (const figure of [achievement.cover, ...achievement.sections.flatMap((section) => [section.figure, ...(section.figures || [])]).filter(Boolean)]) {
      assert.match(figure.src, /^\/static\/media\/achievements\/[a-z0-9-]+\.(?:png|svg|webp|jpg)$/);
      assert.ok(figure.alt && figure.width > 0 && figure.height > 0);
      if (figure.caption !== undefined) assert.ok(typeof figure.caption === 'string' && figure.caption.trim());
    }
  }
});
