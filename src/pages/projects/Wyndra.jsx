import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import ProjectOverview from '../../components/portfolio/ProjectOverview';
import WyndraShowcase from '../../components/interactive/WyndraShowcase';

export default function Wyndra() {
  return (
    <>
      <SEO
        title="Wyndra — Apple Weather-Inspired iOS App | Sri Villiam Sai"
        description="A beautiful, Apple Weather-inspired iOS weather app built with SwiftUI. Features dynamic weather backgrounds, glassmorphic UI, real-time weather data, and detailed weather metrics."
        canonical="/wyndra"
      />

      {/* Hero Section */}
      <section aria-labelledby="hero-heading" className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:gap-16">
          <div className="flex gap-12 lg:gap-16">
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-12">
              <h1 className="heading-xl flex-1" id="hero-heading">
                Wyndra
              </h1>
              <div className="flex w-full flex-1 flex-col gap-8">
                <p className="text-muted-foreground text-base lg:text-lg">
                  A beautiful, Apple Weather-inspired iOS weather app built with SwiftUI. Features dynamic weather
                  backgrounds, glassmorphic UI, real-time weather data, and detailed weather metrics — all crafted with
                  100% native Swift and zero external dependencies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProjectOverview id="wyndra" />

      {/* Section 1: Home Screen */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex-1 pitstop-phone-container">
            <img
              alt="Wyndra home screen"
              className="pitstop-phone-img"
              loading="lazy"
              decoding="async"
              src="/static/media/wyndra/wyndra_home.png"
              style={{ maxWidth: '260px', maxHeight: '560px' }}
            />
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <div className="section-title-gap-lg flex flex-col items-start">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                Home Screen
              </div>
              <h2 className="heading-lg text-foreground">Apple Weather-Style Design</h2>
              <div className="text-muted-foreground">
                <p className="mb-4">
                  Experience weather like never before with a stunning night sky theme and glassmorphic card design. The
                  home screen displays your current temperature, weather conditions, hourly forecasts, and 14-day
                  predictions — all presented in a beautifully layered, Apple-inspired interface.
                </p>
                <p className="mb-4">
                  The app automatically detects your location using CoreLocation and displays real-time weather data
                  powered by the OpenWeather One Call 3.0 API. Dynamic animated backgrounds respond to current
                  conditions — see rain drops, snow flakes, twinkling stars, or drifting clouds depending on your local
                  weather.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Forecast View */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex flex-1 flex-col gap-6 order-2 lg:order-1">
            <div className="section-title-gap-lg flex flex-col items-start">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                Forecast View
              </div>
              <h2 className="heading-lg text-foreground">Hourly & Daily Forecasts</h2>
              <div className="text-muted-foreground">
                <p className="mb-4">
                  Swipe through a beautifully designed forecast view with hourly temperature trends and a comprehensive
                  14-day outlook. Each day's forecast includes high/low temperatures, weather icons, and precipitation
                  probability — giving you all the data you need at a glance.
                </p>
                <p className="mb-4">
                  The slide view features smooth SwiftUI animations and transitions, with weather cards that elegantly
                  present wind speed, UV index, sunrise/sunset times, and moon phase data. Every metric card uses
                  glassmorphism for a premium, translucent feel that stays consistent with the Apple design language.
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 pitstop-phone-container order-1 lg:order-2">
            <img
              alt="Wyndra slide view"
              className="pitstop-phone-img"
              loading="lazy"
              decoding="async"
              src="/static/media/wyndra/wyndra_slideview.png"
              style={{ maxWidth: '260px', maxHeight: '560px' }}
            />
          </div>
        </div>
      </section>

      {/* Section 3: Interactive In-Depth Metrics Showcase */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12">
          <div className="section-title-gap-lg flex flex-col items-center text-center max-w-2xl">
            <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
              Detailed Metrics
            </div>
            <h2 className="heading-lg text-foreground">In-Depth Weather Analytics</h2>
            <div className="text-muted-foreground">
              <p>
                Click the phone below to cycle through each detailed metric view and explore all analytics of Wyndra.
              </p>
            </div>
          </div>

          <WyndraShowcase />
        </div>
      </section>

      {/* Section 4: Settings */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="flex flex-1 flex-col gap-6 order-2 lg:order-1">
            <div className="section-title-gap-lg flex flex-col items-start">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                Settings
              </div>
              <h2 className="heading-lg text-foreground">Personalize Your Experience</h2>
              <div className="text-muted-foreground">
                <p className="mb-4">
                  Customize Wyndra to fit your preferences. Switch between Metric (°C) and Imperial (°F) units, set your
                  default city for when location services are unavailable, and configure notification preferences for
                  weather alerts.
                </p>
                <p className="mb-4">
                  The settings screen also lets you manage saved locations, toggle background animation effects, and
                  report issues directly from within the app. Every configuration is persisted locally using Swift's
                  UserDefaults, ensuring your preferences are always remembered.
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 pitstop-phone-container order-1 lg:order-2">
            <img
              alt="Wyndra settings screen"
              className="pitstop-phone-img"
              loading="lazy"
              decoding="async"
              src="/static/media/wyndra/wyndra_setting.png"
              style={{ maxWidth: '260px', maxHeight: '560px' }}
            />
          </div>
        </div>
      </section>

      {/* Section 5: Tech Stack */}
      <section className="bg-background section-padding-y">
        <div className="container-padding-x container mx-auto flex flex-col items-center gap-12 md:gap-16">
          <div className="flex flex-col gap-8 max-w-3xl">
            <div className="section-title-gap-lg flex flex-col items-start">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                Tech Stack
              </div>
              <h2 className="heading-lg text-foreground">Built with 100% Native Swift</h2>
              <div className="text-muted-foreground">
                <p className="mb-4">
                  Wyndra is built entirely with SwiftUI and Swift 5.9, targeting iOS 17+. The app uses a clean MVVM
                  architecture with dedicated Services for API calls, location management, and data caching. No external
                  dependencies are required — it's 100% native Swift.
                </p>
                <p className="mb-4">
                  <strong className="text-foreground">Frontend:</strong> SwiftUI for declarative UI, custom glassmorphic
                  components, animated weather backgrounds using Canvas and TimelineView, CoreLocation for GPS-based
                  location detection, and Combine for reactive state management across ViewModels.
                </p>
                <p className="mb-4">
                  <strong className="text-foreground">Backend / Services:</strong> OpenWeather One Call 3.0 API for
                  real-time weather data, AirQuality and Pollen services for health-related metrics, CacheService for
                  offline data persistence, AlertService for weather warnings, and VisibilityService for atmospheric
                  condition calculations.
                </p>
                <p className="mb-4">
                  <strong className="text-foreground">Architecture:</strong> MVVM pattern with WeatherViewModel as the
                  central state manager. Modular view extensions under ModernHome keep the codebase clean and
                  maintainable.
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
                  Learn more about Wyndra's native iOS architecture and weather data services.
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
                  What weather data provider does Wyndra use?
                </h3>
                <p className="text-muted-foreground text-base">
                  Wyndra integrates with OpenWeather's One Call 3.0 API, providing hyper-local current conditions,
                  minute-by-minute precipitation forecasts, and comprehensive 14-day daily forecasts.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  Are the weather animations GPU-accelerated?
                </h3>
                <p className="text-muted-foreground text-base">
                  Yes, background weather particle animations (rain, snowfall, floating stars) are built using SwiftUI's
                  TimelineView and Canvas APIs, running at silky-smooth 60fps or 120fps ProMotion on supported iPhones.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  Does Wyndra support offline viewing?
                </h3>
                <p className="text-muted-foreground text-base">
                  Yes, Wyndra contains a CacheService that persists the latest fetched weather datasets locally, ensuring
                  you can always check recent conditions even with zero network connectivity.
                </p>
              </div>
              <div className="flex flex-col gap-3" role="listitem">
                <h3 className="text-card-foreground text-base font-semibold font-mono">
                  Does the app require any third-party dependencies?
                </h3>
                <p className="text-muted-foreground text-base">
                  None at all. Wyndra is 100% native Swift with zero CocoaPods or Swift Package Manager third-party
                  bloat, minimizing binary footprint and maximizing battery life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
