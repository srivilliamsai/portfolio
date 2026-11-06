import React from 'react';
import { Link } from 'react-router-dom';
import BookingContact from '../components/portfolio/BookingContact';
import LinkArrow from '../components/common/LinkArrow';
import SEO from '../components/common/SEO';
import Reveal from '../components/common/Reveal';
import { useTheme } from '../context/ThemeContext';
import Skills from '../components/portfolio/Skills';
import FeaturedProjects from '../components/portfolio/FeaturedProjects';
import Contributions from '../components/portfolio/Contributions';
import { portfolio } from '../data/portfolio';
import { scrollToSection } from '../utils/scroll';

export default function Home() {
  const { isDark } = useTheme();

  return (
    <>
      <SEO
        title="SRI VILLIAM SAI, Product developer"
        description="Sri Villiam Sai is a product developer building web applications, native iOS apps and SaaS products, from interfaces to backend services."
        canonical="/"
      />

      {/* Hero Section */}
      <section aria-labelledby="hero-heading" className="home-welcome bg-background section-padding-y border-b border-border">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex flex-1 flex-col gap-6 lg:gap-8 items-center lg:items-start">
            <div className="section-title-gap-xl flex flex-col items-center lg:items-start text-center lg:text-left">
              <span className="home-welcome-signature">
              <img
                alt="Sri Villiam Sai"
                className="animate-rise"
                data-nimg="1"
                decoding="async"
                height="30"
                loading="lazy"
                src="/static/media/sri-villiam-sai.svg"
                style={{ color: 'transparent' }}
                width="140"
              />
              </span>
              <h1 className="heading-xl animate-rise-2" id="hero-heading">
                <span>I build products,</span>{' '}<span>end to end.</span>
              </h1>
              <p className="home-welcome-role animate-rise-3">Product developer · Web & iOS</p>
              <div className="home-welcome-notes text-muted-foreground animate-rise-3">
                <p>I turn everyday problems into useful software. Currently building <Link className="about-project-link" to="/dinedesk">DineDesk</Link> for restaurants and <Link className="about-project-link" to="/invoice-picker">Invoice Picker</Link> for freelancers.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row w-full justify-center lg:justify-start animate-rise-4">
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-gradient-to-b from-neutral-500 from-0% via-neutral-600 via-10% to-neutral-700 to-100% text-white shadow-xs hover:bg-gradient-to-b hover:from-neutral-400 hover:via-neutral-500 hover:to-neutral-700 border border-black h-9 px-4 py-2 has-[>svg]:px-3 cursor-pointer"
                data-slot="button"
              >
                Contact me
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 px-4 py-2 has-[>svg]:px-3 cursor-pointer"
                data-slot="button"
              >
                View projects
              </button>
            </div>
          </div>
          <div className="w-full flex-1 animate-rise-3">
            <div data-radix-aspect-ratio-wrapper="" style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
              <div data-slot="aspect-ratio" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
                <img
                  alt="Illustrated side-profile portrait of Sri Villiam Sai"
                  className="h-full w-full rounded-xl object-cover"
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  src={isDark ? "/static/media/home_hero-section.png" : "/static/media/home_hero-section-light.png"}
                  style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0 }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProjects />
      <Skills />

      {/* About Me Section */}
      <section className="portfolio-section bg-background section-padding-y border-b" id="about-me">
        <Reveal className="container-padding-x container mx-auto flex flex-col items-center gap-12 md:gap-16 lg:flex-row">
          <div className="order-2 w-full flex-1 lg:order-1">
            <div data-radix-aspect-ratio-wrapper="" style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
              <div data-slot="aspect-ratio" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
                <img
                  alt="Illustrated portrait of Sri Villiam Sai"
                  className="rounded-xl object-fill"
                  loading="lazy"
                  decoding="async"
                  src={isDark ? "/static/media/home_feature-section.png" : "/static/media/home_feature-section-light.png"}
                  style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0 }}
                />
              </div>
            </div>
          </div>
          <div className="order-1 flex flex-1 flex-col gap-8 lg:order-2">
            <div className="section-title-gap-lg flex flex-col items-start">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                About
              </div>
              <h2 className="heading-lg text-foreground">About me: learning by building.</h2>
              <div className="flex flex-col gap-5 text-muted-foreground">
                <p>
                  I’m Sri Villiam Sai, a product developer building web, iOS, and SaaS products—from interfaces to backend services—with Java, Spring Boot, React, and SwiftUI.
                </p>
                <p>
                  My work includes <Link className="about-project-link" to="/pitstop">PitStop</Link>, <Link className="about-project-link" to="/carbon-footprint">Carbon Footprint</Link>, <Link className="about-project-link" to="/wyndra">Wyndra</Link>, and <Link className="about-project-link" to="/glassora">Glassora</Link>. I’m also building <Link className="about-project-link" to="/dinedesk">DineDesk</Link> for restaurants and <Link className="about-project-link" to="/invoice-picker">Invoice Picker</Link> for freelancers.
                </p>
                <p>
                  I hold a {portfolio.education.qualification} and am pursuing an {portfolio.currentEducation.qualification}. My experience includes Zidio Development, Infosys Springboard training, and contributions to Workday’s public developer catalog.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => scrollToSection('contact')}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-gradient-to-b from-neutral-500 from-0% via-neutral-600 via-10% to-neutral-700 to-100% text-white shadow-xs hover:bg-gradient-to-b hover:from-neutral-400 hover:via-neutral-500 hover:to-neutral-700 border border-black h-10 md:h-9 px-4 py-2 has-[>svg]:px-3 w-full sm:w-auto cursor-pointer"
                data-slot="button"
              >
                Contact me
              </button>
              <Link
                to="/achievements"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 px-4 py-2 has-[>svg]:px-3 w-full sm:w-auto cursor-pointer"
                data-slot="button"
              >
                Achievements
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Experience Section */}
      <section id="experience" aria-labelledby="testimonial-title" className="bg-background section-padding-y border-b">
        <Reveal className="container-padding-x container mx-auto">
          <div className="flex flex-col gap-10 md:gap-12">
            <div className="section-title-gap-lg flex w-full flex-col items-center text-center md:items-start md:text-left">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                Experience
              </div>
              <h2 className="heading-lg text-foreground" id="testimonial-title">
                Java Full Stack Developer <span className="hidden-mobile">- Intern</span>
              </h2>
            </div>
            <div className="flex flex-col gap-8 md:flex-row md:gap-12">
              <div className="flex flex-col gap-8 flex-1">
                <p className="text-foreground text-center text-lg leading-7 md:text-left font-mono">
                  Worked as an intern to develop and optimize scalable web applications. Engineered robust backend
                  services with{' '}
                  <span className="font-medium px-1.5 py-0.5 rounded-xs bg-neutral-900 text-white dark:bg-white dark:text-black highlight-tag">Java & Spring Boot</span>, and collaborated
                  effectively in an agile environment to deliver seamless features.
                </p>
                <div className="flex flex-col items-center gap-5 md:flex-row">
                  <span
                    className="relative flex size-8 shrink-0 overflow-hidden rounded-full h-14 w-14 bg-white border border-border"
                    data-slot="avatar"
                  >
                    <img
                      alt="Zidio Development"
                      className="aspect-square size-full object-contain p-1"
                      loading="lazy"
                      decoding="async"
                      src="/static/media/zidiopng.png"
                    />
                  </span>
                  <div className="flex flex-col gap-1 text-center md:text-left">
                    <p className="text-foreground text-base leading-6 font-semibold">
                      Zidio Development <span className="hidden-mobile">(Jul '25 - Sep '25)</span>
                    </p>
                    <p className="text-muted-foreground text-base leading-6">Bangalore, India</p>
                  </div>
                </div>
              </div>
              <div className="bg-border hidden w-[1px] self-stretch md:block"></div>
              <div
                className="shrink-0 w-full bg-border md:hidden"
                data-orientation="horizontal"
                data-slot="separator-root"
                role="none"
                style={{ height: '1px', width: '100%', backgroundColor: 'var(--border)' }}
              ></div>
              <div className="flex flex-col gap-8 flex-1">
                <p className="text-foreground text-center text-lg leading-7 md:text-left font-mono">
                  Participated in comprehensive technical training covering the complete software development lifecycle.
                  Built dynamic web interfaces and{' '}
                  <span className="font-medium px-1.5 py-0.5 rounded-xs bg-neutral-900 text-white dark:bg-white dark:text-black highlight-tag">integrated databases</span> to gain practical,
                  hands-on full stack development experience.
                </p>
                <div className="flex flex-col items-center gap-5 md:flex-row">
                  <span
                    className="relative flex size-8 shrink-0 overflow-hidden rounded-full h-14 w-14 bg-white border"
                    data-slot="avatar"
                  >
                    <img
                      alt="Infosys Springboard"
                      className="aspect-square size-full object-contain p-1"
                      loading="lazy"
                      decoding="async"
                      src="/static/media/infosysspringboard.png"
                    />
                  </span>
                  <div className="flex flex-col gap-1 text-center md:text-left">
                    <p className="text-foreground text-base leading-6 font-semibold">
                      Infosys Springboard <span className="hidden-mobile">(Nov '25 - Jan '26)</span>
                    </p>
                    <p className="text-muted-foreground text-base leading-6">Remote</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Contributions />

      <section id="certifications" aria-labelledby="certs-title" className="portfolio-section bg-background section-padding-y border-b">
        <div className="container container-padding-x mx-auto credentials-summary">
          <div>
            <p className="portfolio-eyebrow">Always learning</p>
            <h2 id="certs-title" className="heading-lg">Learning, put into practice.</h2>
            <p className="text-muted-foreground">My learning spans cloud development, databases, AI tools, and software fundamentals. Explore the certificates and community experiences behind that learning.</p>
          </div>
          <Link className="portfolio-metal-button" to="/certificates">Certificates</Link>
        </div>
      </section>


      <BookingContact />
    </>
  );
}
