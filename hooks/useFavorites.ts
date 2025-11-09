"use client";

import { useState, useEffect } from "react";

export function useFavorites() {
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const updateFavoritesCount = () => {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavoritesCount(favorites.length);
    };

    // Initial count
    updateFavoritesCount();

    // Listen for changes to localStorage
    window.addEventListener("storage", updateFavoritesCount);

    // Clean up event listener
    return () => {
      window.removeEventListener("storage", updateFavoritesCount);
    };
  }, []);

  return { favoritesCount };
}
