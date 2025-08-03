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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <GamepadIcon size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Game Tutor</h1>
            <Sparkles size={24} className="text-yellow-500" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <GamepadIcon size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No games found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters to find more games.
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Game Tutor - Powered by Gemini AI</p>
          <p className="mt-1">Learn, Play, and Have Fun! 🎮</p>
        </footer>
      </div>
    </div>
  );
}
