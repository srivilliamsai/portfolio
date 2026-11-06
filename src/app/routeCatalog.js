import { blogPosts } from '../data/blogs.js';
import { achievements, achievementPath } from '../data/achievements.js';

export const pageRoutes = [
  { path: '', page: 'Home', index: true },
  { path: 'projects', page: 'Projects' },
  { path: 'achievements', page: 'Achievements' },
  { path: 'certificates', page: 'Certificates' },
  { path: 'achievements/:slug', page: 'AchievementDetail' },
  { path: 'blog', page: 'BlogIndex' },
  { path: 'blog/:slug', page: 'BlogPost' },
  { path: 'carbon-footprint', page: 'CarbonFootprint' },
  { path: 'glassora', page: 'Glassora' },
  { path: 'pitstop', page: 'Pitstop' },
  { path: 'wyndra', page: 'Wyndra' },
  { path: 'dinedesk', page: 'DineDesk' },
  { path: 'invoice-picker', page: 'InvoicePicker' },
  { path: 'privacy-policy', page: 'PrivacyPolicy' },
  { path: 'terms-of-service', page: 'TermsOfService' },
  { path: 'cookies-settings', page: 'CookiesSettings' },
  { path: 'faq', page: 'FAQ' },
];

export const canonicalPaths = [
  ...pageRoutes.filter((route) => !route.path.includes(':')).map((route) => `/${route.path}`),
  ...blogPosts.map((post) => `/blog/${post.slug}`),
  ...achievements.map(achievementPath),
];

export const legacyRedirects = [
  ...pageRoutes.filter((route) => !route.path.includes(':')).map((route) => ({
    from: route.index ? 'index.html' : `${route.path}.html`, to: `/${route.path}`,
  })),
  ...blogPosts.map((post) => ({ from: `${post.slug}.html`, to: `/blog/${post.slug}` })),
];
