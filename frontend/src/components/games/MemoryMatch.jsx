import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const CARDS = [
    { id: 1, content: "🌿", label: "Growth" },
    { id: 2, content: "💪", label: "Strength" },
    { id: 3, content: "☀️", label: "Hope" },
    { id: 4, content: "🧘", label: "Peace" },
    { id: 5, content: "❤️", label: "Love" },
    { id: 6, content: "🧠", label: "Focus" },
];

const MemoryMatch = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [disabled, setDisabled] = useState(false);

    // Shuffle logic
    const shuffleCards = () => {
        const duplicated = [...CARDS, ...CARDS].map((card, i) => ({
            ...card,
            uniqueId: i
        }));

        // Fisher-Yates shuffle
        for (let i = duplicated.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [duplicated[i], duplicated[j]] = [duplicated[j], duplicated[i]];
        }

        setCards(duplicated);
        setFlipped([]);
        setMatched([]);
    };

    useEffect(() => {
        shuffleCards();
    }, []);

    // Handle Card Click
    const handleClick = (id) => {
        if (disabled || flipped.includes(id) || matched.includes(cards.find(c => c.uniqueId === id).id)) return;

        const newFlipped = [...flipped, id];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setDisabled(true);
            const [first, second] = newFlipped;
            const cardOne = cards.find(c => c.uniqueId === first);
            const cardTwo = cards.find(c => c.uniqueId === second);

            if (cardOne.id === cardTwo.id) {
                setMatched(prev => [...prev, cardOne.id]);
                setFlipped([]);
                setDisabled(false);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setDisabled(false);
                }, 1000);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="flex justify-between w-full max-w-lg mb-6 text-white">
                <h2 className="text-2xl font-bold">Mindful Match</h2>
                <button onClick={shuffleCards} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                    <RefreshCw size={20} />
                </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {cards.map((card) => {
                    const isFlipped = flipped.includes(card.uniqueId);
                    const isMatched = matched.includes(card.id);

                    return (
                        <div
                            key={card.uniqueId}
                            onClick={() => handleClick(card.uniqueId)}
                            className={`
                relative w-20 h-24 sm:w-24 sm:h-32 cursor-pointer transition-all duration-500 transform preserve-3d
                ${isFlipped || isMatched ? 'rotate-y-180' : ''}
              `}
                            style={{ transformStyle: 'preserve-3d', transform: (isFlipped || isMatched) ? 'rotateY(180deg)' : 'rotateY(0)' }}
                        >
                            {/* Back of Card */}
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl backface-hidden flex items-center justify-center border-2 border-white/20"
                                style={{ backfaceVisibility: 'hidden' }}
                            >
                                <span className="text-2xl opacity-50">✨</span>
                            </div>

                            {/* Front of Card */}
                            <div
                                className="absolute inset-0 bg-white rounded-xl backface-hidden flex flex-col items-center justify-center shadow-xl border-2 border-indigo-200"
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                            >
                                <span className="text-4xl">{card.content}</span>
                                <span className="text-xs mt-2 font-medium text-gray-600">{card.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {matched.length === CARDS.length && (
                <div className="mt-8 p-4 bg-green-500/20 border border-green-500 rounded-xl text-green-300 animate-bounce">
                    All matches found! Well done.
                </div>
            )}
        </div>
    );
};

export default MemoryMatch;