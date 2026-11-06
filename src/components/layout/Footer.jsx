import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { navigation } from '../../data/portfolio';

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer aria-label="Site footer" className="portfolio-footer bg-background border-t">
      <div className="container mx-auto portfolio-footer-container">
        <div className="portfolio-footer-top">
          <Link to="/" className="portfolio-footer-brand" aria-label="Sri Villiam Sai, home">
            <img className="portfolio-brand-wordmark" src={isDark ? '/static/media/logo-wordmark.png' : '/static/media/logo-wordmark-light.png'} alt="Sri Villiam Sai" width="180" height="38" />
            <img className="portfolio-brand-avatar" src="/static/media/logo-avatar.png" alt="Sri Villiam Sai" width="32" height="32" />
          </Link>
          <nav aria-label="Footer navigation" className="portfolio-footer-navigation">
            <Link to="/">Home</Link>
            {navigation.map((item) => <Link key={item.to} to={item.to}>{item.label}</Link>)}
            <Link to="/#contact">Contact</Link>
          </nav>
          <nav aria-label="Social media links" className="portfolio-footer-socials">
<a
              aria-label="GitHub profile"
              className="portfolio-social-link"
              href="https://github.com/srivilliamsai"
              rel="noreferrer"
              target="_blank"
            >
              <svg aria-hidden="true" focusable="false" height="24" viewBox="-2 -2 28 28" width="24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  fill="currentColor"
                ></path>
              </svg>
            </a>
<a
              aria-label="LinkedIn profile"
              className="portfolio-social-link"
              href="https://www.linkedin.com/in/srivilliamsai/"
              rel="noreferrer"
              target="_blank"
            >
              <svg aria-hidden="true" focusable="false" height="24" viewBox="-2 -2 28 28" width="24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  fill="currentColor"
                ></path>
              </svg>
            </a>
<a
              aria-label="Instagram profile"
              className="portfolio-social-link"
              href="https://www.instagram.com/sriwilliamsai"
              rel="noreferrer"
              target="_blank"
            >
              <svg aria-hidden="true" focusable="false" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
                  fill="currentColor"
                ></path>
              </svg>
            </a>
<a
              aria-label="X profile"
              className="portfolio-social-link"
              href="https://x.com/srivilliamsai"
              rel="noreferrer"
              target="_blank"
            >
              <svg aria-hidden="true" focusable="false" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m17.687 3.063l-4.996 5.711l-4.32-5.711H2.112l7.477 9.776l-7.086 8.099h3.034l5.469-6.25l4.78 6.25h6.102l-7.794-10.304l6.625-7.571zm-1.064 16.06L5.654 4.782h1.803l10.846 14.34z"
                  fill="currentColor"
                ></path>
              </svg>
            </a>
          </nav>
        </div>
        <div className="portfolio-footer-bottom">
          <p>© {new Date().getFullYear()} srivilliamsai</p>
          <div className="portfolio-footer-options">
            <nav aria-label="Legal links">
              <Link to="/blog">Blog</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-of-service">Terms of Service</Link>
              <Link to="/cookies-settings">Cookies Settings</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
