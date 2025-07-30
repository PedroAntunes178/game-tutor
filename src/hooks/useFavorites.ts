'use client';

import { useState, useEffect, useCallback } from 'react';
import { Game } from '@/types/game';

const FAVORITES_STORAGE_KEY = 'game-tutor-favorites';

// Helper function to safely get initial favorites from localStorage
function getInitialFavorites(): Game[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
}

// Helper function to safely save favorites to localStorage
function saveFavoritesToStorage(favorites: Game[]) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const initialFavorites = getInitialFavorites();
    setFavorites(initialFavorites);
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      saveFavoritesToStorage(favorites);
    }
  }, [favorites, isLoaded]);

  const addFavorite = useCallback((game: Game) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === game.id)) {
        return prev; // Already in favorites
      }
      const newFavorites = [...prev, game];
      return newFavorites;
    });
  }, []);

  const removeFavorite = useCallback((game: Game) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(fav => fav.id !== game.id);
      return newFavorites;
    });
  }, []);

  const toggleFavorite = useCallback((game: Game) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === game.id);
      if (isFavorite) {
        return prev.filter(fav => fav.id !== game.id);
      } else {
        return [...prev, game];
      }
    });
  }, []);

  const isFavorite = useCallback((game: Game) => {
    return favorites.some(fav => fav.id === game.id);
  }, [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    isLoaded,
  };
}
