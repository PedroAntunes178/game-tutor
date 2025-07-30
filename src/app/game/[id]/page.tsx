'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Users, Clock, Brain } from 'lucide-react';
import games from '@/data';
import { Game } from '@/types/game';

export default function GamePage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'card-games': return 'bg-blue-100 text-blue-800';
      case 'board-games': return 'bg-purple-100 text-purple-800';
      case 'icebreaker-games': return 'bg-pink-100 text-pink-800';
      case 'get-together-games': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Find the game by converting the URL slug back to match the game name
  const game = games.find(g => 
    g.name.toLowerCase().replace(/\s+/g, '-') === id ||
    g.id === id
  ) as Game | undefined;

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Game not found</h1>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Games</span>
        </button>

        {/* Game Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{game.name}</h1>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(game.category)}`}>
                  {game.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                {game.description}
              </p>
            </div>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {game.difficulty}
            </span>
          </div>

          {/* Game Stats */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={18} />
              <span className="font-medium">{game.minPlayers}-{game.maxPlayers} players</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={18} />
              <span className="font-medium">{game.duration}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {game.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* AI Tutorial Assistant */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">AI Tutorial Assistant</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Get personalized instructions and start learning how to play {game.name}
            </p>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors cursor-pointer">
              Start Tutorial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
