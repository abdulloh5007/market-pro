"use client";

import React, { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import pako from "pako";

interface NotFoundPlayerProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  loop?: boolean;
  autoplay?: boolean;
}

export const NotFoundPlayer = React.memo(
  ({ src, className, style, loop = false, autoplay = false }: NotFoundPlayerProps) => {
    const [animationData, setAnimationData] = useState<object | null>(null);
    const lottieRef = useRef<any>(null);

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

    useEffect(() => {
      if (lottieRef.current && autoplay) {
        lottieRef.current.play();
      }
    }, [animationData, autoplay]);

    if (!animationData) {
      return <div className="w-full h-full bg-muted/20 rounded-lg animate-pulse" />;
    }

    return (
      <div
        style={style}
        className={`w-full h-full flex items-center justify-center ${className || ""}`}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={loop}
          autoplay={autoplay}
          renderer="canvas"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }
);

NotFoundPlayer.displayName = "TgsPlayer";
