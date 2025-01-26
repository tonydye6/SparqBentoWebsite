import { useRef } from 'react';

export function TeamCard() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="w-full h-full bg-gradient-to-b from-carbon to-carbon/80">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        onLoadStart={() => console.log('Video load started')}
        onError={(e) => console.error('Video error:', e)}
        onPlay={() => console.log('Video started playing')}
      >
        <source src="/teaser_1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}