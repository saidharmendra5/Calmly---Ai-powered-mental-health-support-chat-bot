import React from 'react';
import { Link } from 'react-router-dom';
import { games } from '../data/games';
import { Gamepad2, Heart, Zap, Sparkles } from 'lucide-react';

const GameLibrary = () => {
    return (
        <div className="flex flex-col h-full bg-gray-900 text-white overflow-y-auto">

            {/* Header Section - Slimmer Version */}
            <div className="bg-gray-800 border-b border-gray-700 px-8 py-3">
                <h1 className="text-2xl font-semibold flex items-center gap-3">
                    <Gamepad2 className="text-blue-400" size={24} />
                    Relaxation Zone
                </h1>
                <p className="text-gray-400 mt-1 text-sm max-w-2xl">
                    Take a break from your thoughts. These interactive experiences are designed to help you ground yourself
                </p>
            </div>

            {/* Grid Section */}
            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map((game) => (
                        <Link
                            key={game.id}
                            to={`/app/game/${game.id}`}
                            className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {/* Thumbnail Container */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={game.thumbnail}
                                    alt={game.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />

                                {/* Category Badge */}
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/10 flex items-center gap-1">
                                    {game.category === 'Therapy' && <Heart size={12} className="text-red-400" />}
                                    {game.category === 'Focus' && <Zap size={12} className="text-yellow-400" />}
                                    {game.category === 'Relaxation' && <Sparkles size={12} className="text-blue-400" />}
                                    {game.category}
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className="p-5">
                                <h3 className="text-lg font-bold mb-1 group-hover:text-blue-400 transition-colors">
                                    {game.title}
                                </h3>
                                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                                    {game.description}
                                </p>

                                <div className="mt-4 flex items-center text-blue-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                    Play Now →
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameLibrary;