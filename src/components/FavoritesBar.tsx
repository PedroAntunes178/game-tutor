'use client';

import { Game } from '@/types/game';
import { Heart, X } from 'lucide-react';

interface FavoritesBarProps {
  favorites: Game[];
  onRemoveFavorite: (game: Game) => void;
  onGameClick: (game: Game) => void;
}

export default function FavoritesBar({ favorites, onRemoveFavorite, onGameClick }: FavoritesBarProps) {
  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Heart size={20} className="text-red-500 fill-current" />
        <h2 className="text-lg font-semibold text-gray-800">Your Favorites</h2>
        <span className="text-sm text-gray-500">({favorites.length})</span>
      </div>
      
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {favorites.map((game) => (
            <div
              key={game.id}
              className="flex-shrink-0 bg-white rounded-lg shadow-sm border border-gray-200 p-3 min-w-[250px] max-w-[250px] hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => onGameClick(game)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900 text-sm truncate pr-2">{game.name}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(game);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex-shrink-0"
                  title="Remove from favorites"
                >
                  <X size={16} />
                </button>
              </div>
              
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{game.description}</p>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{game.minPlayers}-{game.maxPlayers} players</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                  {game.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'Easy': return 'bg-green-100 text-green-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    case 'Hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
