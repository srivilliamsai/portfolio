import React, { useState, useRef, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

const metrics = [
  {
    title: "Conditions",
    dark: "/static/media/wyndra/wyndra_conditions.png",
    light: "/static/media/wyndra/wyndra_conditions.png",
    desc: (
      <>
        <p>Get a comprehensive overview of the current weather conditions with detailed 24-hour temperature graphs. The interactive chart lets you visualize the precise temperature fluctuations throughout the day and into the night.</p>
        <p>Beyond just the temperature, you'll see the apparent "feels like" temperature, daily precipitation summaries, and atmospheric highs and lows. The clean, intuitive interface makes it easy to understand exactly what to expect when you step outside.</p>
      </>
    )
  },
  {
    title: "Humidity",
    dark: "/static/media/wyndra/wyndra_humidity.png",
    light: "/static/media/wyndra/wyndra_humidity.png",
    desc: (
      <>
        <p>Monitor moisture levels with precision. The humidity detail view provides real-time percentage readings along with dew point calculations, helping you understand how the air actually feels.</p>
        <p>Historical data comparisons show you how today's humidity stacks up against the weekly average. This is crucial for planning outdoor activities, managing frizzy hair days, or simply staying comfortable.</p>
      </>
    )
  },
  {
    title: "Visibility",
    dark: "/static/media/wyndra/wyndra_visibility.png",
    light: "/static/media/wyndra/wyndra_visibility.png",
    desc: (
      <>
        <p>Stay safe on the roads with accurate visibility metrics. Whether it's fog, haze, or clear skies, Wyndra tells you exactly how far you can see in kilometers or miles.</p>
        <p>The interface uses subtle gradients to visually represent visibility conditions—from crystal clear days to dense fog warnings—ensuring you're never caught off guard by poor driving conditions.</p>
      </>
    )
  },
  {
    title: "Pressure",
    dark: "/static/media/wyndra/wyndra_pressure.png",
    light: "/static/media/wyndra/wyndra_pressure.png",
    desc: (
      <>
        <p>Track atmospheric pressure changes to predict incoming weather fronts. The pressure gauge visualizes rising and falling trends, which are key indicators of storm systems or clearing skies.</p>
        <p>For those sensitive to pressure changes (like migraine sufferers), this data is invaluable. The app highlights rapid drops or spikes, giving you a heads-up before the weather turns.</p>
      </>
    )
  }
];

export default function WyndraShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const reduceMotion = useReducedMotion();
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const cycleNextMetric = () => {
    if (fading) return;
    if (reduceMotion) {
      setCurrentIndex((prev) => (prev + 1) % metrics.length);
      return;
    }
    setFading(true);
    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % metrics.length);
      setFading(false);
    }, 200);
  };

  const metric = metrics[currentIndex];

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center max-w-5xl mx-auto w-full mt-8">
      <div className="flex w-full flex-1 flex-col items-center gap-4">
      <button
        type="button"
        className="metric-preview-button flex w-full justify-center items-center relative cursor-pointer group"
        id="metric-phone-view"
        onClick={cycleNextMetric}
        aria-label={`Show next weather metric. Current: ${metric.title}`}
        aria-controls="metric-content"
        aria-describedby="metric-instruction"
      >
        <img
          alt={metric.title}
          className={`pitstop-phone-img transition-all duration-200 group-hover:scale-105 ${
            fading ? 'opacity-0' : 'opacity-100'
          }`}
          id="metric-img-dark"
          loading="lazy"
          decoding="async"
          src={metric.dark}
          style={{ maxWidth: '260px', maxHeight: '560px' }}
        />
      </button>
      <p id="metric-instruction" className="text-muted-foreground text-sm">Select the preview to explore the next metric.</p>
      <p className="sr-only" role="status" aria-live="polite">Showing {metric.title}</p>
      </div>
      <div
        className={`flex flex-col gap-6 w-full flex-1 lg:pl-8 text-center lg:text-left transition-opacity duration-300 ${
          fading ? 'opacity-0' : 'opacity-100'
        }`}
        id="metric-content"
      >
        <div>
          <h3 className="text-4xl font-bold mb-4 text-foreground font-mono" id="metric-title">
            {metric.title}
          </h3>
          <div className="text-muted-foreground text-lg leading-relaxed flex flex-col gap-4" id="metric-desc">
            {metric.desc}
          </div>
        </div>
      </div>
    </div>
  );
}
