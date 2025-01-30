import { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

export function TeamCard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Default to unmuted

  useEffect(() => {
    // Cleanup function to pause video when component unmounts
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-carbon to-carbon/80 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 backdrop-blur-sm bg-black/20 hover:bg-black/40"
        onClick={toggleMute}
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4 text-white" />
        ) : (
          <Volume2 className="h-4 w-4 text-white" />
        )}
      </Button>

      {!videoError ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
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