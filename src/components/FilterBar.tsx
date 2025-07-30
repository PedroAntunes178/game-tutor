'use client';

import { Search, Filter } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  playerCount: number;
  onPlayerCountChange: (count: number) => void;
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
}: FilterBarProps) {
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

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 lg:gap-3">
          <div className="min-w-0 sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-0 sm:w-40">
            <select
              value={selectedDifficulty}
              onChange={(e) => onDifficultyChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-0 sm:w-36">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Players:
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={playerCount || ''}
                onChange={(e) => onPlayerCountChange(parseInt(e.target.value) || 0)}
                placeholder="Any"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
