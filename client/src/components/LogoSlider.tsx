
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
