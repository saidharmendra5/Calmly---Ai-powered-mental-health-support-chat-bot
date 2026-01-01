import React, { useState } from 'react';

// A simple solvable board (0 represents empty)
const INITIAL_BOARD = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

const SOLUTION = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

const Sudoku = () => {
    const [grid, setGrid] = useState(INITIAL_BOARD);
    const [selectedCell, setSelectedCell] = useState(null);
    const [error, setError] = useState(false);

    const handleInput = (num) => {
        if (!selectedCell) return;
        const [r, c] = selectedCell;

        // Check against solution immediately (Simple mode)
        if (SOLUTION[r][c] === num) {
            const newGrid = [...grid];
            newGrid[r] = [...grid[r]];
            newGrid[r][c] = num;
            setGrid(newGrid);
            setError(false);
        } else {
            setError(true);
            setTimeout(() => setError(false), 500);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-2">
            <h2 className="text-2xl font-bold mb-4">Calm Sudoku</h2>

            <div className={`grid grid-cols-9 gap-0.5 bg-gray-600 border-2 border-gray-500 p-1 mb-6 ${error ? 'animate-shake' : ''}`}>
                {grid.map((row, rIndex) => (
                    row.map((cell, cIndex) => {
                        const isInitial = INITIAL_BOARD[rIndex][cIndex] !== 0;
                        const isSelected = selectedCell && selectedCell[0] === rIndex && selectedCell[1] === cIndex;

                        return (
                            <div
                                key={`${rIndex}-${cIndex}`}
                                onClick={() => !isInitial && setSelectedCell([rIndex, cIndex])}
                                className={`
                  w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg font-medium cursor-pointer
                  ${(cIndex + 1) % 3 === 0 && cIndex !== 8 ? 'mr-1' : ''}
                  ${(rIndex + 1) % 3 === 0 && rIndex !== 8 ? 'mb-1' : ''}
                  ${isInitial ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-900'}
                  ${isSelected ? 'bg-blue-200' : ''}
                `}
                            >
                                {cell !== 0 ? cell : ''}
                            </div>
                        );
                    })
                ))}
            </div>

            {/* Numpad */}
            <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                        key={num}
                        onClick={() => handleInput(num)}
                        className="w-10 h-10 bg-blue-600 rounded-full font-bold hover:bg-blue-500 active:scale-95 transition-all"
                    >
                        {num}
                    </button>
                ))}
            </div>
            <style>{`
        .animate-shake { animation: shake 0.5s; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
      `}</style>
        </div>
    );
};

export default Sudoku;