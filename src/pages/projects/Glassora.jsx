import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import ProjectOverview from '../../components/portfolio/ProjectOverview';

export default function Glassora() {
  return (
    <>
      <SEO
        title="Glassora — Premium iOS Wallpaper App | Sri Villiam Sai"
        description="Glassora is an iOS application crafted with SwiftUI and Firebase, delivering hand-picked 4K and 8K wallpapers with liquid glassmorphic design and real-time cloud sync."
        canonical="/glassora"
      />

      {/* Hero Section */}
      <section aria-labelledby="hero-heading" className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:gap-16">
          <div className="flex gap-12 lg:gap-16">
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-12">
              <h1 className="heading-xl flex-1" id="hero-heading">
                Glassora
              </h1>
              <div className="flex w-full flex-1 flex-col gap-8">
                <p className="text-muted-foreground text-base lg:text-lg">
                  Glassora is an iOS application crafted with SwiftUI and Firebase, delivering hand-picked 4K and 8K
                  wallpapers. Featuring a fluid glassmorphism interface, real-time Firestore database sync, and fast
                  Cloudflare R2 storage — built natively for Apple devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProjectOverview id="glassora" />

      {/* Section 1: Home Screen */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex-1 pitstop-phone-container">
            <img
              alt="Glassora home screen"
              className="pitstop-phone-img"
              loading="lazy"
              decoding="async"
              src="/static/media/glassora/glassora-one.png"
              style={{ maxWidth: '260px', maxHeight: '560px' }}
            />
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <div className="section-title-gap-lg flex flex-col items-start">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                Home Screen
              </div>
              <h2 className="heading-lg text-foreground">Explore Premium Wallpapers</h2>
              <div className="text-muted-foreground">
                <p className="mb-4">
                  Browse trending artworks, new weekly arrivals, and a live catalog of high-resolution wallpapers. The
                  home screen presents a clean, modern dashboard with segmented filtering options, a search bar, and
                  seamless scrolling.
                </p>
                <p className="mb-4">
                  Wallpapers are streamed dynamically from Firebase Firestore. Implements a responsive layout that
                  automatically adjusts column spans and provides smooth image transitions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Categories */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex flex-1 flex-col gap-6 order-2 lg:order-1">
            <div className="section-title-gap-lg flex flex-col items-start">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                Categories
              </div>
              <h2 className="heading-lg text-foreground">Themed Wallpaper Categories</h2>
              <div className="text-muted-foreground">
                <p className="mb-4">
                  Explore specialized wallpaper collections grouped by themes. The categories dashboard presents
                  gorgeous glassmorphic cards representing individual categories like Abstract, Animal, Anime, Comics,
                  Digital Art, and Fantasy.
                </p>
                <p className="mb-4">
                  Each category card acts as a dynamic gateway to a filtered grid. The card layout utilizes custom
                  scale-down touch animations, clear iconography, and live category item counters synced from Firestore.
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 pitstop-phone-container order-1 lg:order-2">
            <img
              alt="Glassora categories screen"
              className="pitstop-phone-img"
              loading="lazy"
              decoding="async"
              src="/static/media/glassora/glassora-two.png"
              style={{ maxWidth: '260px', maxHeight: '560px' }}
            />
          </div>
        </div>
      </section>

      {/* Section 3: Wallpaper Details */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex-1 pitstop-phone-container">
            <img
              alt="Glassora wallpaper detail view"
              className="pitstop-phone-img"
              loading="lazy"
              decoding="async"
              src="/static/media/glassora/glassora-three.png"
              style={{ maxWidth: '260px', maxHeight: '560px' }}
            />
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <div className="section-title-gap-lg flex flex-col items-start">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                Wallpaper Details
              </div>
              <h2 className="heading-lg text-foreground">Liquid Glassmorphic UI</h2>
              <div className="text-muted-foreground">
                <p className="mb-4">
                  Explore stunning wallpaper details inside a gorgeous layout. The detail view showcases a floating card
                  overlay styled with liquid glassmorphism, featuring dynamic blurs, soft drop shadows, and subtle
                  gradient highlights.
                </p>
                <p className="mb-4">
                  A simple tap anywhere on the wallpaper toggles the overlay UI off and on using fluid, synchronized
                  spring animations, letting users admire the artwork in full-screen mode without distractions.
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
                Tech Stack
              </div>
              <h2 className="heading-lg text-foreground">Clean, Asynchronous iOS Architecture</h2>
              <div className="text-muted-foreground">
                <p className="mb-4">
                  Glassora is designed using a clean, modern iOS architecture. The front-end leverages SwiftUI for
                  structured views and custom transitions, Combine for reactive states, and native caching protocols to
                  reduce server load.
                </p>
                <p className="mb-4">
                  <strong className="text-foreground">Frontend Framework:</strong> Built on SwiftUI (iOS 15.0+) following
                  the MVVM design pattern. Incorporates dedicated viewmodels (HomeViewModel, DetailViewModel,
                  FavoritesViewModel) to cleanly decouple UI layout from data flows. Implements custom modifiers for
                  glassmorphic layouts, shimmers, and haptic actions.
                </p>
                <p className="mb-4">
                  <strong className="text-foreground">Backend & Storage:</strong> Utilizes Firebase Firestore's watch
                  streams for live real-time synchronization of categories and wallpaper metadata. High-resolution
                  wallpaper binary assets are distributed via Cloudflare R2 storage containers utilizing secure, signed
                  URLs.
                </p>
                <p className="mb-4">
                  <strong className="text-foreground">Automation & Deployment:</strong> Integrated Python management
                  scripts allow publishing and categories cleaning straight from terminal commands without Firebase
                  console access. Features full Xcode Cloud CI/CD configuration to automatically build, run test suites,
                  and push to TestFlight testers on branch merges.
                </p>
                <p className="mb-4">
                  <strong className="text-foreground">Test Suite:</strong> Includes an automated test project with 237 test
                  cases validating viewModel state transitions, data repositories, mock network pipelines, and
                  credentials management.
                </p>
              </div>
            </div>

            {/* Project Links (Pure Logo Icons: Website & App Store) */}
            <div aria-label="Project links" className="flex items-center justify-center gap-6 pt-6">
              <a
                aria-label="Live Website"
                className="text-foreground transition-all duration-300 hover:scale-110"
                href="https://glassora.vercel.app"
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
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </a>

              <a
                aria-label="Download on App Store"
                className="text-foreground transition-all duration-300 hover:scale-110"
                href="https://apps.apple.com/in/app/glassora-wallpapers-hd-4k/id6777764126"
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
                  <path d="M8 16l1.106-1.99m1.4-2.522L13 7"></path>
                  <path d="M7 14h5m2.9 0H17"></path>
                  <path d="M16 16l-2.51-4.518m-1.487-2.677L11 7"></path>
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
                  Discover more about how Glassora renders high-quality wallpaper content and syncs dynamically.
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
                  Where are the 4K wallpapers stored?
                </h3>
                <p className="text-muted-foreground text-base">
                  High-resolution wallpaper assets are stored and distributed using Cloudflare R2 bucket storage to
                  maximize download throughput and minimize latency globally.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  How are new wallpapers published?
                </h3>
                <p className="text-muted-foreground text-base">
                  A custom Python CLI script lets administrators upload new wallpapers and trigger metadata updates to
                  Firebase Firestore directly from the command line without manual console intervention.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  Does Glassora support offline access?
                </h3>
                <p className="text-muted-foreground text-base">
                  Yes, favorited wallpapers and cached thumbnails are automatically preserved offline through an
                  integrated FavoritesManager with local persistent storage.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  What version of iOS is supported?
                </h3>
                <p className="text-muted-foreground text-base">
                  Glassora is built natively using SwiftUI and requires iOS 15.0 or later, taking advantage of modern
                  Swift async/await concurrency and Apple design standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
