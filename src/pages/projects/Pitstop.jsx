import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import ProjectOverview from '../../components/portfolio/ProjectOverview';

export default function Pitstop() {
  return (
    <>
      <SEO
        title="PitStop — Roadside Assistance App | Sri Villiam Sai"
        description="PitStop - A roadside assistance web project. Find fuel stations, compare prices, and get emergency help on the go."
        canonical="/pitstop"
      />

      {/* Hero Section */}
      <section aria-labelledby="hero-heading" className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:gap-16">
          <div className="flex gap-12 lg:gap-16">
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-12">
              <h1 className="heading-xl flex-1" id="hero-heading">
                PitStop
              </h1>
              <div className="flex w-full flex-1 flex-col gap-8">
                <p className="text-muted-foreground text-base lg:text-lg">
                  PitStop is a responsive web interface concept for finding nearby fuel stations, comparing service options, and exploring roadside assistance. This walkthrough focuses on interface design and navigation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProjectOverview id="pitstop" />

      {/* Section 1: Getting Started */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex-1 pitstop-phone-container">
            <img
              alt="PitStop onboarding screen"
              className="pitstop-phone-img"
              loading="lazy"
              decoding="async"
              src="/static/media/pitstop/pitstop-one.png"
              style={{ maxWidth: '260px', maxHeight: '560px' }}
            />
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <div className="section-title-gap-lg flex flex-col items-start">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                Getting Started
              </div>
              <h2 className="heading-lg text-foreground">Roadside Assistance, Reimagined</h2>
              <div className="text-muted-foreground">
                <p className="mb-4">
                  The onboarding studies explore a short path from arrival to choosing a vehicle and service. The goal is to make the next action clear before asking a visitor to navigate a larger map.
                </p>
                <p className="mb-4">
                  Sign-in and assistance screens describe a proposed product flow. They do not demonstrate live identity providers, dispatch operations or an emergency response service.
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
                Dashboard
              </div>
              <h2 className="heading-lg text-foreground">Compare Fuel Prices & Services</h2>
              <div className="text-muted-foreground">
                <p className="mb-4">
                  The dashboard concept groups fuel stations and services into scannable cards. Price comparison, fuel delivery, towing and repair are interface scenarios shown in the design.
                </p>
                <p className="mb-4">
                  A clear hierarchy puts the service choice before supporting details. Prices, availability and ratings shown in the walkthrough should be read as illustrative interface content.
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 pitstop-phone-container order-1 lg:order-2">
            <img
              alt="PitStop dashboard screen"
              className="pitstop-phone-img"
              loading="lazy"
              decoding="async"
              src="/static/media/pitstop/pitstop-two.png"
              style={{ maxWidth: '260px', maxHeight: '560px' }}
            />
          </div>
        </div>
      </section>

      {/* Section 3: Navigation */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex-1 pitstop-phone-container">
            <img
              alt="PitStop navigation map screen"
              className="pitstop-phone-img"
              loading="lazy"
              decoding="async"
              src="/static/media/pitstop/pitstop-three.png"
              style={{ maxWidth: '260px', maxHeight: '560px' }}
            />
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <div className="section-title-gap-lg flex flex-col items-start">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                Navigation
              </div>
              <h2 className="heading-lg text-foreground">Interactive Map & Quick Services</h2>
              <div className="text-muted-foreground">
                <p className="mb-4">
                  The map-based web concept uses React, Vite and Leaflet to explore place discovery. Search and service filters organize the browsing experience around a visitor’s next task.
                </p>
                <p className="mb-4">
                  Map pins and service details are part of the interface concept. Live location tracking, station availability and verified pricing require separate integrations and are not established by these screenshots.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Tech Stack */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 md:gap-16">
          <div className="flex flex-col gap-8 max-w-3xl">
            <div className="section-title-gap-lg flex flex-col items-start">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                Results
              </div>
              <h2 className="heading-lg text-foreground">A clear boundary between versions</h2>
              <div className="text-muted-foreground">
                <p className="mb-4">
                  This portfolio case study describes the React web concept. My public PitStop repository contains a separate Flutter/Dart implementation, with backend work in its own repository. Their source, integrations and release status should be evaluated independently.
                </p>
              </div>
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
              <Link className="w-full" to="/carbon-footprint">
                <div
                  className="text-card-foreground border group flex cursor-pointer flex-col justify-between gap-6 rounded-none border-none bg-transparent p-0 shadow-none"
                  data-slot="card"
                  role="listitem"
                >
                  <div className="flex flex-col gap-3 p-0" data-slot="card-content">
                    <h3 className="text-base leading-normal font-semibold">Carbon Footprint</h3>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-normal">
                      Track and reduce your carbon emissions with personalized insights and eco-friendly
                      recommendations.
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
                          alt="Carbon Footprint thumbnail"
                          loading="lazy" decoding="async"
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                          height="1000"
                          src="/static/media/projectcover/carbon-footprint-cover.png"
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
                  Here are some common questions about how PitStop helps EV drivers navigate with confidence.
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
                  What is the main focus of PitStop?
                </h3>
                <p className="text-muted-foreground text-base">
                  PitStop is your ultimate on-demand vehicle support app, primarily focused on delivering fuel directly
                  to your location and providing comprehensive roadside assistance whenever you need it.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  How does the emergency roadside assistance work?
                </h3>
                <p className="text-muted-foreground text-base">
                  In any emergency situation, you can use PitStop to instantly dispatch a nearby certified mechanic or
                  tow truck. Our real-time GPS tracking ensures help arrives as quickly as possible.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  Can I get fuel delivered anywhere?
                </h3>
                <p className="text-muted-foreground text-base">
                  Yes, PitStop's seamless fuel delivery service allows you to pin your current location on the map, and
                  our delivery partners will provide high-quality fuel right to your parked vehicle.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  How does the "Buy Now, Pay Later" option work?
                </h3>
                <p className="text-muted-foreground text-base">
                  We understand that emergencies can be unexpected. PitStop features a flexible Buy Now, Pay Later
                  integrated payment system, allowing you to split your service costs into manageable installments.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">Is PitStop available 24/7?</h3>
                <p className="text-muted-foreground text-base">
                  Absolutely. Vehicle emergencies don't stick to a schedule, so our fuel delivery and roadside assistance
                  dispatch network operates 24 hours a day, 7 days a week.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  Can I track my service provider on the map?
                </h3>
                <p className="text-muted-foreground text-base">
                  Yes, once a service provider or fuel delivery truck is dispatched, you can track their exact location
                  and estimated time of arrival through the app's interactive live map.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
