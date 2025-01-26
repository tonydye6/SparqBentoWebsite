import { useState, useRef } from 'react';

export function TeamCard() {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
        setVideoError(true);
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
      className="relative w-full h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-carbon/80 z-10" />
      {isHovered ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover absolute inset-0"
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
          className="w-full h-full object-cover absolute inset-0"
          alt="Team Teaser Poster"
          onError={() => {
            console.error('Error loading poster image');
            setImageError(true);
          }}
        />
      )}
      <div className="relative z-20 w-full h-full flex items-center justify-center">
        <div className="text-center p-4">
          <h3 className="text-2xl font-bold mb-2">Sparq Gaming Revolution</h3>
          <p className="text-sm text-gray-200">Experience the future of college sports gaming</p>
        </div>
      </div>
    </div>
  );
}