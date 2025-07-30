'use client';

import { Game } from '@/types/game';
import { Heart, X, Users, Clock } from 'lucide-react';

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
        <Heart size={18} className="text-red-500 fill-current" />
        <h3 className="text-lg font-semibold text-gray-800">Your Favorites</h3>
        <span className="text-sm text-gray-500">({favorites.length})</span>
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex gap-3 pb-2 min-w-max">
          {favorites.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 min-w-[250px] max-w-[250px] hover:shadow-md transition-all duration-200 cursor-pointer group relative"
              onClick={() => onGameClick(game)}
            >
              {/* Remove Button */}
              <div className="absolute top-3 right-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(game);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                  title="Remove from favorites"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="pr-8">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm line-clamp-1 flex-1">
                    {game.name}
                  </h4>
                </div>

                <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                  {game.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Users size={10} />
                      <span>{game.minPlayers}-{game.maxPlayers}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={10} />
                      <span className="truncate">{game.duration.split(' ')[0]}</span>
                    </div>
                  </div>
                  
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </span>
                </div>
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
