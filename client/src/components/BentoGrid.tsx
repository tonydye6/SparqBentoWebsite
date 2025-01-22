// tailwind.config.js
module.exports = {
  content: [],
  theme: {
    extend: {
      keyframes: {
        "logo-cloud": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - 4rem))" },
        },
      },
      animation: {
        "logo-cloud": "logo-cloud 35s linear infinite",
      },
    },
  },
  plugins: [],
}

// pages/index.js
"use client";

import { LogoSlider } from "./components/LogoSlider";

export const BentoGrid = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Main Content</div>
      <LogoSlider />
    </main>
  );
};


//components/LogoSlider.tsx
"use client";

interface Logo {
  name: string;
  url: string;
}

const logos: Logo[] = [
  {
    name: "Vercel",
    url: "https://res.cloudinary.com/dfhp33ufc/image/upload/v1715881430/vercel_wordmark_dark_mhv8u8.svg"
  },
  {
    name: "Nextjs", 
    url: "https://res.cloudinary.com/dfhp33ufc/image/upload/v1715881475/nextjs_logo_dark_gfkf8m.svg"
  },
  {
    name: "Firebase",
    url: "https://res.cloudinary.com/dknydkolo/image/upload/v1732330008/lvyfry3aylrsoqppodtb.svg"
  },
  {
    name: "MongoDb",
    url: "https://res.cloudinary.com/dknydkolo/image/upload/v1732330127/hifim7cwispw3xpx38nw.svg"
  }
];

const LogoSlider = (): JSX.Element => {
  return (
    <div className="w-full py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div
          className="group relative mt-6 flex gap-6 overflow-hidden p-2"
          style={{
            maskImage:
              "linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 95%)",
          }}>
          {Array(5)
            .fill(null)
            .map((_, outerIndex) => (
              <div
                key={`logo-row-${outerIndex}`}
                className="flex shrink-0 animate-logo-cloud flex-row justify-around gap-6">
                {logos.map((logo, innerIndex) => (
                  <img
                    key={`logo-${outerIndex}-${innerIndex}`}
                    src={logo.url}
                    className="h-10 w-28 px-2 brightness-0 dark:invert"
                    alt={`${logo.name}`}
                  />
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LogoSlider;