import { useRef } from 'react';

export function TeamCard() {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
    >
      <source src="/teaser_1.mp4" type="video/mp4" />
    </video>
  );
}