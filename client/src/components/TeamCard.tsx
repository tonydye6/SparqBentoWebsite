
import { useRef, useState } from 'react';

export function TeamCard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="w-full h-full bg-gradient-to-b from-carbon to-carbon/80">
      {!videoError ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          onError={() => setVideoError(true)}
          poster="/ftcc.png"
        >
          <source src="/teaser_1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img 
          src="/ftcc.png" 
          alt="Teaser Fallback"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
