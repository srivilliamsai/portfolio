import React from 'react';
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
        title="Sri Villiam Sai | Full Stack Developer"
        description="Sri Villiam Sai — Full Stack Developer specializing in Java, Spring Boot, and modern web technologies. Explore my projects, blog, and more."
        canonical="/"
      />

      {/* Hero Section */}
      <section aria-labelledby="hero-heading" className="bg-background section-padding-y border-b border-border">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex flex-1 flex-col gap-6 lg:gap-8 items-center lg:items-start">
            <div className="section-title-gap-xl flex flex-col items-center lg:items-start text-center lg:text-left">
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
              <h1 className="heading-xl animate-rise-2" id="hero-heading">
                Full Stack Developer
              </h1>
              <p className="text-muted-foreground text-base lg:text-lg animate-rise-3">
                Bringing your ideas to life with clean, efficient, and scalable code. Whether it's building web apps,
                optimizing performance, or solving complex technical challenges.
              </p>
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
                  alt="Hero section visual"
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
                  alt="Feature section image"
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
              <h2 className="heading-lg text-foreground">About me: curious by default.</h2>
              <p className="text-muted-foreground">
                I’m a software developer who learns by making things. My Java and Spring Boot work taught me to think about the logic behind an interface; SwiftUI gives me another way to explore the experience in front of it.
                <br />
                <br />
                From a carbon-footprint project to weather and wallpaper apps, I enjoy taking an idea from a small experiment to something people can explore. My internships at Zidio Development and Infosys Springboard helped me put that curiosity into practice.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => scrollToSection('contact')}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-gradient-to-b from-neutral-500 from-0% via-neutral-600 via-10% to-neutral-700 to-100% text-white shadow-xs hover:bg-gradient-to-b hover:from-neutral-400 hover:via-neutral-500 hover:to-neutral-700 border border-black h-10 md:h-9 px-4 py-2 has-[>svg]:px-3 w-full sm:w-auto cursor-pointer"
                data-slot="button"
              >
                Contact me
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 px-4 py-2 has-[>svg]:px-3 w-full sm:w-auto cursor-pointer"
                data-slot="button"
              >
                View projects
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Experience Section */}
      <Contributions />
      <section aria-labelledby="testimonial-title" className="bg-background section-padding-y border-b">
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

      <section id="certifications" aria-labelledby="certs-title" className="portfolio-section bg-background section-padding-y border-b">
        <div className="container container-padding-x mx-auto credentials-summary">
          <div>
            <p className="portfolio-eyebrow">Always learning</p>
            <h2 id="certs-title" className="heading-lg">Learning, put into practice.</h2>
            <p className="text-muted-foreground">My learning spans cloud development, databases, AI tools, and software fundamentals. Explore my public credential profile for individual issuers and badge details.</p>
          </div>
          <a className="portfolio-button" href={portfolio.credentials} target="_blank" rel="noreferrer">View credentials on Credly <LinkArrow /></a>
        </div>
      </section>

      {/* Contact Section */}
      <section
        aria-labelledby="contact-heading"
        className="bg-background section-padding-y border-b"
        id="contact"
        style={{ scrollMarginTop: '2rem' }}
      >
        <Reveal className="container-padding-x container mx-auto flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-8 text-center md:items-start md:text-left">
              <div className="section-title-gap-lg mx-auto flex flex-col items-center md:items-start">
                <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                  Contact me
                </div>
                <h2 className="heading-lg" id="contact-heading">
                  Let's talk!
                </h2>
                <p className="text-muted-foreground">
                  Feel free to reach out! I'm here to help and will respond within 24 hours. Your questions matter to
                  me!
                </p>
              </div>
            </div>
          </div>
          <div
            className="bg-border shrink-0 w-full block md:hidden"
            data-orientation="horizontal"
            data-slot="separator-root"
            role="none"
            style={{ height: '1px', width: '100%', backgroundColor: 'var(--border)' }}
          ></div>
          <div className="md:bg-muted/40 flex w-full flex-1 flex-col items-center rounded-xl md:items-start md:p-12 lg:border lg:border-border">
            <div className="flex flex-1 flex-col gap-8 md:gap-12">
              <a
                className="flex cursor-pointer flex-col items-center gap-5 md:flex-row md:items-start"
                href="tel:+917339312067"
              >
                <svg
                  aria-hidden="true"
                  className="lucide lucide-phone text-primary h-6 w-6"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                </svg>
                <div className="flex flex-col gap-2 text-center md:text-left">
                  <h3 className="text-card-foreground text-base leading-6 font-semibold font-mono">Call me</h3>
                  <span className="text-muted-foreground text-base hover:text-primary">
                    +91 73393 12067
                  </span>
                </div>
              </a>

              <a
                className="flex cursor-pointer flex-col items-center gap-5 md:flex-row md:items-start"
                href="mailto:srivilliamsai@gmail.com"
              >
                <svg
                  aria-hidden="true"
                  className="lucide lucide-mail text-primary h-6 w-6"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                  <rect height="16" rx="2" width="20" x="2" y="4"></rect>
                </svg>
                <div className="flex flex-col gap-2 text-center md:text-left">
                  <h3 className="text-card-foreground text-base leading-6 font-semibold font-mono">Write an email</h3>
                  <span className="text-muted-foreground text-base hover:text-primary">
                    srivilliamsai@gmail.com
                  </span>
                </div>
              </a>

              <div className="flex cursor-pointer flex-col items-center gap-5 md:flex-row md:items-start">
                <svg
                  aria-hidden="true"
                  className="lucide lucide-map-pin text-primary h-6 w-6"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div className="flex flex-col gap-2 text-center md:text-left">
                  <h3 className="text-card-foreground text-base leading-6 font-semibold font-mono">Location</h3>
                  <span className="text-muted-foreground text-base hover:text-primary">
                    Chennai, India
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ Section */}
      <section
        aria-labelledby="faq-heading"
        className="bg-background section-padding-y"
        id="faq"
        style={{ scrollMarginTop: '2rem' }}
      >
        <Reveal className="container-padding-x container mx-auto">
          <div className="flex w-full flex-col gap-12 md:gap-16">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="section-title-gap-lg flex max-w-xl flex-col items-center text-center md:items-start md:text-left">
                <h2 className="heading-lg text-foreground" id="faq-heading">
                  Frequently asked questions
                </h2>
                <p className="text-muted-foreground">
                  I 've gathered the key information to help you make the most of your experience. If you can 't find
                  what you need, feel free to reach out to me.
                </p>
              </div>
              <div className="flex flex-col gap-3 md:flex-row">
                <a aria-label="Download resume" download="" href="/static/media/resume.pdf" target="_blank" rel="noreferrer">
                  <span
                    aria-label="Download Resume"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-gradient-to-b from-neutral-500 from-0% via-neutral-600 via-10% to-neutral-700 to-100% text-white shadow-xs hover:bg-gradient-to-b hover:from-neutral-400 hover:via-neutral-500 hover:to-neutral-700 border border-black h-10 px-4 py-2 has-[>svg]:px-3 w-full md:w-auto md:h-9 md:text-sm cursor-pointer"
                    data-slot="button"
                  >
                    Resume
                  </span>
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2" role="list">
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">What is your core tech stack?</h3>
                <p className="text-muted-foreground text-base">
                  I specialize in Java and Spring Boot for robust backend services, paired with modern front-end
                  frameworks like React and HTML, CSS and JavaScript. I also have hands-on experience integrating
                  relational databases like MySQL.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  Are you currently open to roles or internships?
                </h3>
                <p className="text-muted-foreground text-base">
                  Yes! I am actively seeking full-time roles or challenging internships where I can contribute to a team,
                  apply my full-stack knowledge, and continue growing as a developer.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  What was your focus at Zidio Development?
                </h3>
                <p className="text-muted-foreground text-base">
                  During my time at Zidio, I focused on building and optimizing backend services. I worked within an
                  agile team to engineer scalable features using Java and Spring Boot.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  How do you approach learning new technologies?
                </h3>
                <p className="text-muted-foreground text-base">
                  I believe in hands-on, project-based learning. My time in the Infosys Springboard program taught me how
                  to quickly adapt to new tools spanning the entire software development lifecycle.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  Do you have experience with databases?
                </h3>
                <p className="text-muted-foreground text-base">
                  Absolutely. I am comfortable designing and querying relational databases, writing optimized SQL, and
                  integrating them seamlessly into dynamic web applications.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  Can you work effectively in an Agile environment?
                </h3>
                <p className="text-muted-foreground text-base">
                  Yes, I am very familiar with agile methodologies. I thrive in collaborative environments, value clear
                  communication, and enjoy participating in sprints to deliver consistent value.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  Do you have experience with iOS development?
                </h3>
                <p className="text-muted-foreground text-base">
                  In addition to full-stack web development, I am passionate about mobile development. I build native iOS
                  applications using Swift and SwiftUI, focusing on fluid animations and native Apple design patterns.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  How do you approach leadership and teamwork?
                </h3>
                <p className="text-muted-foreground text-base">
                  I am deeply passionate about solving complex problems and taking initiative. Whether it's leading a
                  project phase or collaborating with peers, my goal is always to deliver impactful, user-centric
                  solutions while continuously learning.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
