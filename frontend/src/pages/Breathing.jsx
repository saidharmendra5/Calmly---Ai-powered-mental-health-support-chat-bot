import { useState } from 'react';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';
import { breathingExercises } from '../data/mockData';

const BreathingExercise = ({ exercise, isActive, onStart }) => {
  return (
    <div
      className={`p-6 bg-gradient-to-br ${exercise.color} bg-opacity-10 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all cursor-pointer group ${
        isActive ? 'ring-2 ring-white/30' : ''
      }`}
      onClick={onStart}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <Wind className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm text-white/70">{exercise.duration}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{exercise.name}</h3>
      <p className="text-white/70 mb-4">{exercise.description}</p>
      <div className="space-y-2">
        {exercise.steps.map((step, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-sm text-white/60">
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BreathingAnimation = ({ exercise, isPlaying, onToggle, onReset }) => {
  const [phase, setPhase] = useState(0);
  const phases = ['Breathe In', 'Hold', 'Breathe Out', 'Hold'];

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-2">{exercise.name}</h2>
        <p className="text-gray-400 text-center">{exercise.description}</p>
      </div>

      <div className="relative w-80 h-80 flex items-center justify-center mb-8">
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${exercise.color} opacity-20 blur-2xl ${
            isPlaying ? 'animate-breathe' : ''
          }`}
        />
        <div
          className={`w-64 h-64 rounded-full bg-gradient-to-br ${exercise.color} flex items-center justify-center shadow-2xl ${
            isPlaying ? 'animate-breathe' : ''
          }`}
        >
          <div className="text-center">
            <p className="text-2xl font-semibold text-white mb-2">{phases[phase]}</p>
            <p className="text-white/70">Follow the circle</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={onToggle}
          className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all flex items-center space-x-2"
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Start</span>
            </>
          )}
        </button>
        <button
          onClick={onReset}
          className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all flex items-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset</span>
        </button>
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(0.8); opacity: 0.6; }
          25% { transform: scale(1.2); opacity: 1; }
          50% { transform: scale(1.2); opacity: 1; }
          75% { transform: scale(0.8); opacity: 0.6; }
        }

        .animate-breathe {
          animation: breathe 16s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const Breathing = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStart = (exercise) => {
    setSelectedExercise(exercise);
    setIsPlaying(false);
  };

  const handleToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSelectedExercise(null);
  };

  return (
    <div className="h-full bg-gray-900 overflow-y-auto">
      {!selectedExercise ? (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Breathing Exercises</h1>
            <p className="text-gray-400 text-lg">
              Take a moment to breathe. These exercises can help reduce stress, calm your mind, and center your thoughts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {breathingExercises.map((exercise) => (
              <BreathingExercise
                key={exercise.id}
                exercise={exercise}
                isActive={selectedExercise?.id === exercise.id}
                onStart={() => handleStart(exercise)}
              />
            ))}
          </div>
        </div>
      ) : (
        <BreathingAnimation
          exercise={selectedExercise}
          isPlaying={isPlaying}
          onToggle={handleToggle}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default Breathing;
