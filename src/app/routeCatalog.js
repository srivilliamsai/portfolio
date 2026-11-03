import { blogPosts } from '../data/blogs.js';

export const pageRoutes = [
  { path: '', page: 'Home', index: true },
  { path: 'blog', page: 'BlogIndex' },
  { path: 'blog/:slug', page: 'BlogPost' },
  { path: 'carbon-footprint', page: 'CarbonFootprint' },
  { path: 'glassora', page: 'Glassora' },
  { path: 'pitstop', page: 'Pitstop' },
  { path: 'wyndra', page: 'Wyndra' },
  { path: 'privacy-policy', page: 'PrivacyPolicy' },
  { path: 'terms-of-service', page: 'TermsOfService' },
  { path: 'cookies-settings', page: 'CookiesSettings' },
];

export const canonicalPaths = [
  ...pageRoutes.filter((route) => !route.path.includes(':')).map((route) => `/${route.path}`),
  ...blogPosts.map((post) => `/blog/${post.slug}`),
];

export const legacyRedirects = [
  ...pageRoutes.filter((route) => !route.path.includes(':')).map((route) => ({
    from: route.index ? 'index.html' : `${route.path}.html`, to: `/${route.path}`,
  })),
  ...blogPosts.map((post) => ({ from: `${post.slug}.html`, to: `/blog/${post.slug}` })),
];
