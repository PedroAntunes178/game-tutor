'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Game } from '@/types/game';
import GameCard from '@/components/GameCard';
import FilterBar from '@/components/FilterBar';
import FavoritesBar from '@/components/FavoritesBar';
import SponsoredBar from '@/components/SponsoredBar';
import { useFavorites } from '@/hooks/useFavorites';
import games from '@/data';
import { GamepadIcon, Sparkles } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [playerCount, setPlayerCount] = useState(0);
  
  const { favorites, toggleFavorite, isFavorite, removeFavorite } = useFavorites();

  // Get sponsored games sorted by priority (highest first)
  const sponsoredGames = useMemo(() => {
    return (games as Game[])
      .filter(game => game.sponsorPriority && game.sponsorPriority > 0)
      .sort((a, b) => (b.sponsorPriority || 0) - (a.sponsorPriority || 0));
  }, []);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !selectedCategory || game.category === selectedCategory;
      const matchesDifficulty = !selectedDifficulty || game.difficulty === selectedDifficulty;
      const matchesPlayerCount = !playerCount || 
                                (game.minPlayers <= playerCount && game.maxPlayers >= playerCount);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesPlayerCount;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, playerCount]);

  const handleLearnToPlay = (game: Game) => {
    // Convert game name to URL-friendly slug
    const gameSlug = game.name.toLowerCase().replace(/\s+/g, '-');
    router.push(`/game/${gameSlug}`);
  };

  const handleAIRecommendation = (gameId: string) => {
    // Find the game by ID and navigate to it
    const game = games.find(g => g.id === gameId);
    if (game) {
      handleLearnToPlay(game as Game);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-blue-600 rounded-full">
              <GamepadIcon size={24} className="sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Game Tutor</h1>
            <Sparkles size={20} className="sm:w-6 sm:h-6 text-yellow-500" />
          </div>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Learn how to play your favorite games with AI-powered tutorials. 
            From card games to board games, we&apos;ll teach you the rules and strategies step by step!
          </p>
        </div>

        {/* Sponsored Bar */}
        <SponsoredBar
          sponsoredGames={sponsoredGames}
          onGameClick={handleLearnToPlay}
        />

        {/* Filters */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          playerCount={playerCount}
          onPlayerCountChange={setPlayerCount}
          onAIRecommendation={handleAIRecommendation}
        />

        {/* Favorites Bar */}
        <FavoritesBar
          favorites={favorites}
          onRemoveFavorite={removeFavorite}
          onGameClick={handleLearnToPlay}
        />

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game as Game}
              onLearnToPlay={handleLearnToPlay}
              isFavorite={isFavorite(game as Game)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 mb-4">
              <GamepadIcon size={48} className="sm:w-16 sm:h-16 mx-auto" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No games found</h3>
            <p className="text-sm sm:text-base text-gray-500 px-4">
              Try adjusting your search terms or filters to find more games.
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 text-center text-gray-500 text-xs sm:text-sm">
          <p>Game Tutor - Powered by Gemini AI</p>
          <p className="mt-1">Learn, Play, and Have Fun! 🎮</p>
        </footer>
      </div>
    </div>
  );
}
