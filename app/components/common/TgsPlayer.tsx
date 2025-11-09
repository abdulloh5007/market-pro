"use client";

import React, { useState, useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";
import pako from "pako";

interface TgsPlayerProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

export const TgsPlayer = React.memo(({ src, className, style }: TgsPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Загрузка и распаковка TGS
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

  // Инициализация lottie-web анимации
  useEffect(() => {
    if (!animationData || !containerRef.current) return;

    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "canvas",
      loop: false,
      autoplay: false,
      animationData,
    });

    // Событие окончания анимации
    animationRef.current.addEventListener("complete", () => {
      setIsPlaying(false);
    });

    return () => {
      animationRef.current?.destroy();
    };
  }, [animationData]);

  const playOnce = () => {
    if (animationRef.current && !isPlaying) {
      setIsPlaying(true);
      animationRef.current.stop();
      animationRef.current.play();
    }
  };

  if (!animationData) {
    return <div className="w-full h-full bg-muted/20 rounded-lg animate-pulse" />;
  }

  return (
    <div
      className="group flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200/80 text-2xl text-neutral-500 transition-all duration-300 hover:bg-neutral-300/50 dark:bg-neutral-800/80 dark:hover:bg-neutral-800/50"
      onMouseEnter={playOnce} // hover на всей области
    >
      <div
        ref={containerRef}
        style={style}
        className={`w-[24px] h-[24px] flex items-center justify-center ${className || ""}`}
      />
    </div>
  );
});

TgsPlayer.displayName = "TgsPlayer";
