export const siteUrl = import.meta.env.VITE_SITE_URL;
export const absoluteUrl = (path = '/') => new URL(path, `${siteUrl}/`).href;
