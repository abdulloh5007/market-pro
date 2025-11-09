
"use client";

import React, { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import pako from "pako";

interface TgsPlayerProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

export const TgsPlayer = React.memo(
  ({ src, className, style }: TgsPlayerProps) => {
    const [animationData, setAnimationData] = useState<object | null>(null);
    const lottieRef = useRef<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
      const fetchAndDecompress = async () => {
        try {
          const response = await fetch(src);
          const compressed = await response.arrayBuffer();
          const json = pako.inflate(new Uint8Array(compressed), { to: "string" });
          setAnimationData(JSON.parse(json));
        } catch (err) {
          console.error("TGS parse error:", err);
        }
      };
      fetchAndDecompress();
    }, [src]);

    const playOnce = () => {
      if (!lottieRef.current || isPlaying) return;
      setIsPlaying(true);
      lottieRef.current.stop();
      lottieRef.current.play();
    };

    if (!animationData) {
      return <div className="w-full h-full bg-muted/20 rounded-lg animate-pulse" />;
    }

    return (
      <div
        className="group flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200/80 text-2xl text-neutral-500 transition-all duration-300 hover:bg-neutral-300/50 dark:bg-neutral-800/80 dark:hover:bg-neutral-800/50"
        onMouseEnter={playOnce} // <-- теперь hover на всей области
      >
        <div
          style={style}
          className={`w-[24px] h-[24px] flex items-center justify-center ${className || ""}`}
        >
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            loop={false}
            autoplay={false}
            className="w-full h-full object-contain"
            onComplete={() => setIsPlaying(false)}
          />
        </div>
      </div>

    );
  }
);

TgsPlayer.displayName = "TgsPlayer";