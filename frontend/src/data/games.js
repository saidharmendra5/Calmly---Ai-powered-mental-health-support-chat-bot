export const games = [
    {
        id: "memory-match",
        title: "Mindful Match",
        description: "Focus your mind by matching positive affirmations.",
        thumbnail: "/assets/mindful-match-thumbnail.png",
        category: "Focus"
    },
    // NEW GAMES
    {
        id: "flappy-bird",
        title: "Floaty Bird",
        description: "A slower, gentler version of the classic flying game.",
        thumbnail: "/assets/flappybird-thumbnail.png",
        category: "Relaxation"
    }
];

export const getGameById = (id) => games.find(game => game.id === id);