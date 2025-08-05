'use client';

import { Search, Sparkles, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import games from '@/data';
import { ChatMessage } from '@/types/game';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  playerCount: number;
  onPlayerCountChange: (count: number) => void;
  onAIRecommendation: (gameId: string) => void;
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  playerCount,
  onPlayerCountChange,
  onAIRecommendation,
}: FilterBarProps) {
  const [isAsking, setIsAsking] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'card-games', label: 'Card Games' },
    { value: 'board-games', label: 'Board Games' },
    { value: 'icebreaker-games', label: 'Icebreaker Games' },
    { value: 'get-together-games', label: 'Get-Together Games' },
  ];

  const difficulties = [
    { value: '', label: 'Any Difficulty' },
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' },
  ];

  const handleAskAI = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a description of the game you\'re looking for in the search box.');
      return;
    }

    setIsAsking(true);

    try {
      // Create a concise summary of game data to reduce token count
      const gamesData = games.map(game => ({
        id: game.id,
        name: game.name,
        description: game.description,
        category: game.category,
        tags: game.tags
      }));

      const initialPrompt = `You are a game recommendation assistant. Here is a summary of available games:

${JSON.stringify(gamesData, null, 2)}

Based on the user's description, please identify which game they are most likely looking for. Only recommend games from the database above. If the description matches multiple games, recommend the best match. If no games match well, suggest the closest alternatives.

User's description: "${searchQuery}"

Please respond with ONLY the game ID (like "uno", "charades", etc.) of your top recommendation. Do not include any explanation or additional text - just the game ID.`;

      const filterMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: initialPrompt,
        timestamp: new Date()
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [filterMessage]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI recommendation');
      }

      const data = await response.json() as { content: string };
      const gameId = data.content?.trim();

      // Verify the game exists in our database
      const foundGame = games.find(game => game.id === gameId);
      if (foundGame) {
        onAIRecommendation(gameId);
      } else {
        alert('AI couldn\'t find a matching game. Try refining your description.');
      }
    } catch (error) {
      console.error('Error asking AI:', error);
      alert('Sorry, there was an error getting AI recommendations. Please try again.');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Desktop: Single row with search + filters */}
      <div className="hidden lg:flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search games or describe what you're looking for..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>

        {/* Ask AI Button */}
        <button
          onClick={handleAskAI}
          disabled={isAsking || !searchQuery.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Sparkles size={16} className={isAsking ? 'animate-pulse' : ''} />
          <span>{isAsking ? 'Asking AI...' : 'Ask AI'}</span>
        </button>

        {/* Desktop Filters */}
        <div className="min-w-0 w-48">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer text-gray-900"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0 w-40">
          <select
            value={selectedDifficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer text-gray-900"
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty.value} value={difficulty.value}>
                {difficulty.label}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0 w-36">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-900 whitespace-nowrap">
              Players:
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={playerCount || ''}
              onChange={(e) => onPlayerCountChange(parseInt(e.target.value) || 0)}
              placeholder="Any"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Mobile: Separate layout */}
      <div className="lg:hidden">
        {/* Mobile Search Row */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search games or describe what you're looking for..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          {/* Mobile Ask AI Button */}
          <button
            onClick={handleAskAI}
            disabled={isAsking || !searchQuery.trim()}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Sparkles size={16} className={isAsking ? 'animate-pulse' : ''} />
          </button>
        </div>

        {/* Filter Toggle Button */}
        <div className="mb-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Filter size={16} />
            <span className="text-sm">Filters</span>
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Mobile Filters */}
        <div className={`${showFilters ? 'block' : 'hidden'}`}>
          <div className="flex flex-col gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer text-gray-900"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => onDifficultyChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer text-gray-900"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-900 whitespace-nowrap">
                Players:
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={playerCount || ''}
                onChange={(e) => onPlayerCountChange(parseInt(e.target.value) || 0)}
                placeholder="Any"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
