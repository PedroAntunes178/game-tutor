export interface Game {
  id: string;
  name: string;
  category: 'card-games' | 'icebreaker-games' | 'board-games' | 'get-together-games';
  minPlayers: number;
  maxPlayers: number;
  ageRange: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  equipment: string[];
  basicRules: string[];
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface GameSession {
  gameId: string;
  messages: ChatMessage[];
  isActive: boolean;
}
