'use client';

import { Game } from '@/types/game';
import { Users, Clock } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onLearnToPlay: (game: Game) => void;
}

export default function GameCard({ game, onLearnToPlay }: GameCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'card-games': return 'bg-blue-100 text-blue-800';
      case 'board-games': return 'bg-purple-100 text-purple-800';
      case 'icebreaker-games': return 'bg-pink-100 text-pink-800';
      case 'get-together-games': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900">{game.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
          {game.difficulty}
        </span>
      </div>
      
      <div className="mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(game.category)}`}>
          {game.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{game.description}</p>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Users size={16} />
          <span>{game.minPlayers}-{game.maxPlayers} players</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={16} />
          <span>{game.duration}</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Equipment needed:</h4>
        <div className="flex flex-wrap gap-1">
          {game.equipment.slice(0, 3).map((item, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {item}
            </span>
          ))}
          {game.equipment.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              +{game.equipment.length - 3} more
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onLearnToPlay(game)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Learn How to Play
      </button>
    </div>
  );
}
