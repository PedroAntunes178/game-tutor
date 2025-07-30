'use client';

import { Game } from '@/types/game';
import { Star, ExternalLink, Users, Clock } from 'lucide-react';

interface SponsoredBarProps {
  sponsoredGames: Game[];
  onGameClick: (game: Game) => void;
}

export default function SponsoredBar({ sponsoredGames, onGameClick }: SponsoredBarProps) {
  if (sponsoredGames.length === 0) {
    return null;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSponsorClick = (game: Game, e: React.MouseEvent) => {
    e.stopPropagation();
    if (game.sponsorWebsite) {
      window.open(game.sponsorWebsite, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Star size={18} className="text-yellow-500 fill-current" />
        <h3 className="text-lg font-semibold text-gray-800">Sponsored Games</h3>
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex gap-3 pb-2 min-w-max">
          {sponsoredGames.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 min-w-[250px] max-w-[250px] hover:shadow-md transition-all duration-200 cursor-pointer group relative"
              onClick={() => onGameClick(game)}
            >
              {/* Sponsored Badge and External Link */}
              <div className="absolute top-3 right-3 flex items-center gap-1">
                <div className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star size={10} className="fill-current" />
                  <span className="text-xs">Ad</span>
                </div>
                
                {game.sponsorWebsite && (
                  <button
                    onClick={(e) => handleSponsorClick(game, e)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs py-1 px-2 rounded transition-colors flex items-center ml-1"
                    title="Visit sponsor website"
                  >
                    <ExternalLink size={10} />
                  </button>
                )}
              </div>

              <div className="pr-2">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm line-clamp-1 flex-1 pr-16">
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
