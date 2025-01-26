import { useState, useRef } from 'react';

export function TeamCard() {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Video play error:', error);
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
      className="w-full h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isHovered ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          onLoadStart={() => console.log('Video load started')}
          onError={(e) => console.error('Video error:', e)}
        >
          <source src="/teaser_1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="w-full h-full bg-gradient-to-b from-carbon to-carbon/80 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Hover to Play Demo</h3>
            <p className="text-sm text-gray-200">Experience Sparq Gaming</p>
          </div>
        </div>
      )}
    </div>
  );
}