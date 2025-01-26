import { useState, useRef } from 'react';

export function TeamCard() {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className="h-full relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isHovered ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
        >
          <source src="/videos/teaser_1.mp4" type="video/mp4" />
          <source src="/videos/teaser_1.webm" type="video/webm" />
        </video>
      ) : (
        <img
          src="/teaser_1_poster.jpg"
          alt="Team Teaser Poster"
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-carbon/80" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-4">
          <h3 className="text-2xl font-bold mb-2">Sparq Gaming Revolution</h3>
          <p className="text-sm text-gray-200">Experience the future of college sports gaming</p>
        </div>
      </div>
    </div>
  );
}