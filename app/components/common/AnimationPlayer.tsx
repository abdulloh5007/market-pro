"use client";

import React, { useState, useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";
import pako from "pako";

interface AnimationPlayerProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  loop?: boolean;
  autoplay?: boolean;
}

export const AnimationPlayer = React.memo(
  ({ src, className, style, loop = false, autoplay = false }: AnimationPlayerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<AnimationItem | null>(null);
    const [animationData, setAnimationData] = useState<object | null>(null);

    // Загрузка и распаковка TGS / Lottie файла
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
        renderer: "canvas", // canvas тоже можно, если хочешь
        loop,
        autoplay,
        animationData,
      });

      return () => {
        animationRef.current?.destroy();
      };
    }, [animationData, loop, autoplay]);

    return (
      <div
        ref={containerRef}
        style={style}
        className={`w-full h-full flex items-center justify-center ${className || ""}`}
      />
    );
  }
);

AnimationPlayer.displayName = "AnimationPlayer";
