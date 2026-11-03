import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import ProjectOverview from '../../components/portfolio/ProjectOverview';

export default function CarbonFootprint() {
  return (
    <>
      <SEO
        title="Carbon Personal Footprint App | My Portfolio"
        description="Carbon Personal Footprint App - Track, visualize, and reduce your environmental impact. Built with React and Spring Boot."
        canonical="/carbon-footprint"
      />

      {/* Hero Section */}
      <section aria-labelledby="hero-heading" className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:gap-16">
          <div className="flex gap-12 lg:gap-16">
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-12">
              <h1 className="heading-xl flex-1" id="hero-heading">
                Carbon Personal Footprint App
              </h1>
              <div className="flex w-full flex-1 flex-col gap-8">
                <p className="text-muted-foreground text-base lg:text-lg">
                  A full-stack learning project for understanding and reducing personal environmental impact
                  through tracking, education, and gamification. It explores transport, diet, and energy estimates
                  with a React interface and Spring Boot backend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProjectOverview id="carbon-footprint" />

      {/* Section 1: Welcome Page / Get Started */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex-1 carbon-preview-container">
            <img
              alt="Carbon Welcome Page"
              className="carbon-preview-img"
              loading="lazy"
              decoding="async"
              src="/static/media/carbonfootprint/carbon_welcomepage.png"
            />
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <div className="section-title-gap-lg flex flex-col items-start">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                Get Started
              </div>
              <h2 className="heading-lg text-foreground">Track Your Impact.</h2>
              <div className="text-muted-foreground">
                <p className="mb-4">
                  Monitor your personal carbon footprint with precision and elegance. Make mindful choices for a greener
                  future. Track everything from your daily diet to transport and energy usage.
                </p>
                <p className="mb-4">
                  Discover how your lifestyle choices directly affect the environment and begin your journey towards a
                  more sustainable life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Dashboard */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex flex-1 flex-col gap-6 order-2 lg:order-1">
            <div className="section-title-gap-lg flex flex-col items-start">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                Daily Overview
              </div>
              <h2 className="heading-lg text-foreground">Your Sustainability Dashboard</h2>
              <div className="text-muted-foreground">
                <p className="mb-4">
                  Get a comprehensive daily sustainability overview right when you log in. Keep track of today's
                  emissions, review your weekly progress, and stay on top of your personalized targets.
                </p>
                <p className="mb-4">
                  Log custom activities seamlessly — from logging your morning drive to tracking a meatless meal — and
                  instantly unlock new achievements as you build sustainable habits.
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 carbon-preview-container order-1 lg:order-2">
            <img
              alt="Carbon App Dashboard"
              className="carbon-preview-img"
              loading="lazy"
              decoding="async"
              src="/static/media/carbonfootprint/carbon_dashboard.png"
            />
          </div>
        </div>
      </section>

      {/* Section 3: 2-Ton Challenge */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex-1 carbon-preview-container">
            <img
              alt="Annual Footprint Challenge"
              className="carbon-preview-img"
              loading="lazy"
              decoding="async"
              src="/static/media/carbonfootprint/carbon_annual.png"
            />
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <div className="section-title-gap-lg flex flex-col items-start">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                Paris Agreement Goal
              </div>
              <h2 className="heading-lg text-foreground">The 2-Ton Challenge</h2>
              <div className="text-muted-foreground">
                <p className="mb-4">
                  To prevent irreversible climate damage, scientists estimate we need to reach a global average of{' '}
                  <strong>2 tons</strong> of CO<sub>2</sub> per person per year by 2050.
                </p>
                <p className="mb-4">
                  Currently, the gap is massive. Most daily activities—from driving to diet—push us far beyond this
                  sustainable limit. Carbon helps you visualize your daily impact and compares it against regional and
                  global averages, so you can make choices that bring us closer to this vital goal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Global Awareness */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12">
          <div className="section-title-gap-lg flex flex-col items-center text-center max-w-2xl">
            <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
              Global Awareness
            </div>
            <h2 className="heading-lg text-foreground">Understand the Carbon Cycle</h2>
            <div className="text-muted-foreground">
              <p>
                Dive into the science behind climate change and stay informed with real-time global emissions data to
                understand the massive scale of the challenge we face daily.
              </p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center w-full mt-8">
            <div className="flex flex-1 flex-col gap-6 order-2 lg:order-1 text-center lg:text-left">
              <div>
                <h3 className="text-3xl font-bold mb-4 text-foreground font-mono">The Carbon Cycle</h3>
                <div className="text-muted-foreground text-lg leading-relaxed flex flex-col gap-4">
                  <p>
                    Carbon enters the atmosphere through industrial activities and deforestation, trapping heat
                    globally. By understanding the cycle of Production, Impact, and Solution, we can reduce emissions to
                    restore the planet's balance.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 carbon-preview-container order-1 lg:order-2">
              <img
                alt="Carbon Cycle"
                className="carbon-preview-img"
                loading="lazy"
                decoding="async"
                src="/static/media/carbonfootprint/carbon_carboncycle.png"
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center w-full mt-12">
            <div className="flex-1 carbon-preview-container order-1 lg:order-1">
              <img
                alt="World Carbon Watch"
                className="carbon-preview-img"
                loading="lazy"
                decoding="async"
                src="/static/media/carbonfootprint/carbon_watch.png"
              />
            </div>
            <div className="flex flex-1 flex-col gap-6 order-2 lg:order-2 text-center lg:text-left">
              <div>
                <h3 className="text-3xl font-bold mb-4 text-foreground font-mono">World Carbon Watch</h3>
                <div className="text-muted-foreground text-lg leading-relaxed flex flex-col gap-4">
                  <p>
                    Stay informed with the World Carbon Watch, displaying real-time estimated global CO<sub>2</sub>{' '}
                    emissions to remind us of the massive scale of the challenge we face daily.
                  </p>
                  <p>
                    Monitor the live environmental impact and better understand our collective push toward the 2050
                    net-zero goal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Impact */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 md:gap-16">
          <div className="flex flex-col gap-8 max-w-3xl">
            <div className="section-title-gap-lg flex flex-col items-start">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                Impact
              </div>
              <h2 className="heading-lg text-foreground">Driving Sustainable Change</h2>
              <div className="text-muted-foreground">
                <p className="mb-4">
                  The Carbon Personal Footprint App has successfully empowered users to visualize and reduce their
                  environmental impact. By combining real-time tracking with gamified incentives, the platform drives
                  meaningful behavioral change.
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>
                    <strong>Behavioral Shift:</strong> Users engaging with daily challenges reported increased awareness
                    of their consumption habits.
                  </li>
                  <li>
                    <strong>Community Growth:</strong> The leaderboard system fostered a competitive yet collaborative
                    environment for sustainability.
                  </li>
                  <li>
                    <strong>Actionable Insights:</strong> AI-driven recommendations provided users with clear, achievable
                    steps to lower their daily emissions.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Tech Stack */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 md:gap-16">
          <div className="flex flex-col gap-8 max-w-3xl">
            <div className="section-title-gap-lg flex flex-col items-start">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                Tech Stack
              </div>
              <h2 className="heading-lg text-foreground">Built with Modern Web Technologies</h2>
              <div className="text-muted-foreground">
                <p className="mb-4">
                  The Carbon Personal Footprint App leverages a robust full-stack architecture to deliver a seamless and
                  responsive user experience.
                </p>
                <p className="mb-4">
                  <strong className="text-foreground">Frontend:</strong> React.js for component-based UI, Vite for fast
                  builds, and Tailwind CSS for modern styling. Fully integrated dark mode support ensures a comfortable
                  viewing experience in any lighting.
                </p>
                <p className="mb-4">
                  <strong className="text-foreground">Backend:</strong> Spring Boot 3 provides a scalable and secure
                  RESTful API. Hibernate/JPA manages efficient database interactions, while Spring Security with JWT
                  ensures stateless authentication.
                </p>
                <p className="mb-4">
                  <strong className="text-foreground">Data & Infrastructure:</strong> MySQL for persistent relational
                  data storage and Redis for high-performance caching. The architecture is designed for scalability and
                  real-time data processing.
                </p>
              </div>
            </div>

            {/* Project Links (Pure Logo Icons: GitHub & Live Website) */}
            <div aria-label="Project links" className="flex items-center justify-center gap-6 pt-6">
              <a
                aria-label="GitHub Repository"
                className="text-foreground transition-all duration-300 hover:scale-110"
                href="https://github.com/srivilliamsai/CarbonPersonalFootprintApp"
                rel="noreferrer"
                target="_blank"
              >
                <svg
                  height="26"
                  viewBox="-2 -2 28 28"
                  width="26"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                    fill="currentColor"
                  ></path>
                </svg>
              </a>

              <a
                aria-label="Live Website"
                className="text-foreground transition-all duration-300 hover:scale-110"
                href="https://srivilliamsai.github.io/CarbonPersonalFootprintApp/"
                rel="noreferrer"
                target="_blank"
              >
                <svg
                  fill="none"
                  height="26"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="26"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" x2="22" y1="12" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* See my projects */}
      <section aria-labelledby="blog-section-heading" className="bg-background section-padding-y border-b">
        <div className="container-padding-x container mx-auto">
          <div className="flex flex-col items-start gap-10 md:gap-12">
            <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                Portfolio
              </div>
              <h2 className="heading-lg" id="blog-section-heading">
                See my projects
              </h2>
              <p className="text-muted-foreground">
                Take a look at what I've been up to! I love bringing ideas to life and can't wait for you to check out my
                latest creations.
              </p>
            </div>
            <div className="portfolio-card-grid w-full" role="list">
              <Link className="w-full" to="/pitstop">
                <div
                  className="text-card-foreground border group flex cursor-pointer flex-col justify-between gap-6 rounded-none border-none bg-transparent p-0 shadow-none"
                  data-slot="card"
                  role="listitem"
                >
                  <div className="flex flex-col gap-3 p-0" data-slot="card-content">
                    <h3 className="text-base leading-normal font-semibold">PitStop</h3>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-normal">
                      A roadside assistance web project — find fuel stations, compare prices, and get emergency help on
                      the go.
                    </p>
                  </div>
                  <div className="flex items-center [.border-t]:pt-6 p-0" data-slot="card-footer">
                    <div data-radix-aspect-ratio-wrapper="" style={{ position: 'relative', width: '100%', paddingBottom: '75%' }}>
                      <div
                        className="w-full overflow-hidden rounded-xl"
                        data-slot="aspect-ratio"
                        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
                      >
                        <img
                          alt="PitStop thumbnail"
                          loading="lazy" decoding="async"
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                          height="1000"
                          src="/static/media/projectcover/pitstop-cover-landscape.png"
                          style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0 }}
                          width="1000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              <Link className="w-full" to="/glassora">
                <div
                  className="text-card-foreground border group flex cursor-pointer flex-col justify-between gap-6 rounded-none border-none bg-transparent p-0 shadow-none"
                  data-slot="card"
                  role="listitem"
                >
                  <div className="flex flex-col gap-3 p-0" data-slot="card-content">
                    <h3 className="text-base leading-normal font-semibold">Glassora</h3>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-normal">
                      A premium 4K wallpaper application for iOS with dynamic glassmorphism and real-time Firestore sync.
                    </p>
                  </div>
                  <div className="flex items-center [.border-t]:pt-6 p-0" data-slot="card-footer">
                    <div data-radix-aspect-ratio-wrapper="" style={{ position: 'relative', width: '100%', paddingBottom: '75%' }}>
                      <div
                        className="w-full overflow-hidden rounded-xl"
                        data-slot="aspect-ratio"
                        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
                      >
                        <img
                          alt="Glassora thumbnail"
                          loading="lazy" decoding="async"
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                          height="1000"
                          src="/static/media/projectcover/glassora-cover.png"
                          style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0 }}
                          width="1000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              <Link className="w-full" to="/wyndra">
                <div
                  className="text-card-foreground border group flex cursor-pointer flex-col justify-between gap-6 rounded-none border-none bg-transparent p-0 shadow-none"
                  data-slot="card"
                  role="listitem"
                >
                  <div className="flex flex-col gap-3 p-0" data-slot="card-content">
                    <h3 className="text-base leading-normal font-semibold">Wyndra</h3>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-normal">
                      An Apple Weather-inspired iOS app with glassmorphic UI, dynamic backgrounds, and real-time weather
                      data.
                    </p>
                  </div>
                  <div className="flex items-center [.border-t]:pt-6 p-0" data-slot="card-footer">
                    <div data-radix-aspect-ratio-wrapper="" style={{ position: 'relative', width: '100%', paddingBottom: '75%' }}>
                      <div
                        className="w-full overflow-hidden rounded-xl"
                        data-slot="aspect-ratio"
                        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
                      >
                        <img
                          alt="Wyndra thumbnail"
                          loading="lazy" decoding="async"
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                          height="1000"
                          src="/static/media/projectcover/wyndra-cover.png"
                          style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0 }}
                          width="1000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section aria-labelledby="faq-heading" className="bg-background section-padding-y" id="faq">
        <div className="container-padding-x container mx-auto">
          <div className="flex w-full flex-col gap-12 md:gap-16">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="section-title-gap-lg flex max-w-xl flex-col items-center text-center md:items-start md:text-left">
                <h2 className="heading-lg text-foreground" id="faq-heading">
                  Frequently asked questions
                </h2>
                <p className="text-muted-foreground">
                  Learn more about how the Carbon footprint tracker empowers sustainable habits.
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
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  How does the app calculate my carbon footprint?
                </h3>
                <p className="text-muted-foreground text-base">
                  The app uses a comprehensive algorithm that factors in your daily activities—such as diet,
                  transportation, commute, home energy use, and shopping—to estimate your total daily and annual CO
                  <sub>2</sub> emissions.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">What is the "2-Ton Challenge"?</h3>
                <p className="text-muted-foreground text-base">
                  The 2-Ton Challenge is a global initiative aiming to reduce individual CO<sub>2</sub> emissions to a
                  sustainable average of 2 tons per year by 2050 to combat irreversible climate change.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  How do the Gamification features work?
                </h3>
                <p className="text-muted-foreground text-base">
                  You earn eco-credits by logging sustainable actions and completing daily milestones like "Meatless
                  Monday". These points unlock badges and place you on a global friend leaderboard to encourage healthy
                  ecological competition.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  Can I actually fund real-world initiatives?
                </h3>
                <p className="text-muted-foreground text-base">
                  Absolutely! The eco-credits you earn within the app can be redeemed natively in our integrated
                  Marketplace to support verified sustainability projects, like mass-tree-planting and renewable energy
                  grid research.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  Can I connect my smart home devices?
                </h3>
                <p className="text-muted-foreground text-base">
                  The app supports integrations with various smart home ecosystems, allowing it to automatically track
                  your household energy consumption and suggest optimized, automated efficiency tweaks.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  How accurate is the carbon tracking?
                </h3>
                <p className="text-muted-foreground text-base">
                  Our algorithm continuously learns from your logged activities and integrates with local transport
                  datasets to provide a highly accurate, personalized estimate customized to your specific lifestyle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
