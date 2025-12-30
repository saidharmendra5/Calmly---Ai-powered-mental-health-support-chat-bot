import { useState, useEffect, useRef } from 'react';
import { Wind, Play, Pause, RotateCcw, ArrowLeft, Clock, Activity } from 'lucide-react';
import { breathingExercises } from '../data/mockData';

const BreathingExerciseCard = ({ exercise, onStart }) => {
  return (
    <div
      onClick={onStart}
      className="group relative bg-gray-800/40 border border-gray-700/50 hover:border-blue-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-1 cursor-pointer flex flex-col h-full"
    >
      {/* 1. Header with Gradient Icon */}
      <div className="p-6 pb-4 flex items-start justify-between">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${exercise.color} bg-opacity-10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Wind className="w-7 h-7 text-white" />
        </div>

        {/* Duration Badge */}
        <div className="flex items-center space-x-1.5 px-3 py-1 bg-gray-900/50 rounded-lg border border-gray-700/50">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-medium text-gray-300">{exercise.duration}</span>
        </div>
      </div>

      {/* 2. Content Body */}
      <div className="px-6 flex-1">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {exercise.name}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {exercise.description}
        </p>

        {/* Pattern Pills - Darker Aesthetic */}
        <div className="flex flex-wrap gap-2 mb-4">
          {exercise.pattern.map((step, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-gray-900/60 border border-gray-700/30 rounded-md text-[10px] font-medium text-gray-400 uppercase tracking-wide"
            >
              {step.label}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Action Footer (Consistent with Games/Books) */}
      <div className="p-4 mt-auto border-t border-gray-700/50 bg-gray-800/20">
        <div className="w-full py-2 bg-gray-700/50 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 text-white rounded-xl transition-all font-medium text-sm flex items-center justify-center space-x-2">
          <Play className="w-4 h-4 fill-current" />
          <span>Start Session</span>
        </div>
      </div>
    </div>
  );
};

const BreathingSession = ({ exercise, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycles, setCycles] = useState(0);

  const currentStep = exercise.pattern[phaseIndex];
  const timerRef = useRef(null);

  // Animation Loop Logic
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        setPhaseIndex((prev) => {
          const nextIndex = (prev + 1) % exercise.pattern.length;
          if (nextIndex === 0) setCycles(c => c + 1);
          return nextIndex;
        });
      }, currentStep.duration);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, phaseIndex, exercise.pattern, currentStep.duration]);

  const handleToggle = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      clearTimeout(timerRef.current);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
    setPhaseIndex(0);
    setCycles(0);
  };

  return (
    // 1. h-full and overflow-hidden prevent scrolling
    <div className="h-full flex flex-col relative animate-fadeIn px-6 py-4 overflow-hidden">

      {/* Header Row: Back Button & Title */}
      <div className="flex items-center justify-between shrink-0 mb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
        >
          <div className="p-2 bg-gray-800 rounded-full group-hover:bg-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium hidden md:inline">Back</span>
        </button>

        {/* Compact Title for Active Session */}
        <div className="text-right">
          <h2 className="text-xl font-bold text-white flex items-center justify-end gap-2">
            {exercise.name}
            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${exercise.color}`} />
          </h2>
          <p className="text-xs text-gray-500 hidden md:block">{exercise.description}</p>
        </div>
      </div>

      {/* 2. Main Content Area: Flex-1 to take up all available space */}
      <div className="flex-1 flex flex-col items-center justify-evenly min-h-0">

        {/* The Breathing Circle */}
        <div className="relative flex items-center justify-center">
          {/* Outer Glow Ring */}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${exercise.color} opacity-20 blur-3xl transition-all duration-1000`}
            style={{
              transform: isPlaying ? `scale(${currentStep.scale})` : 'scale(1)'
            }}
          />

          {/* Main Circle - Responsive Size (w-64 on mobile, w-80 on desktop) */}
          <div
            className={`w-48 h-48 md:w-48 md:h-48 rounded-full bg-gradient-to-br ${exercise.color} flex flex-col items-center justify-center shadow-2xl z-10 border-4 border-white/5`}
            style={{
              transform: isPlaying ? `scale(${currentStep.scale})` : 'scale(1)',
              transition: isPlaying ? `transform ${currentStep.duration}ms ease-in-out` : 'transform 0.5s ease-out'
            }}
          >
            <div className="text-center transform scale-100 transition-transform duration-300 px-4">
              {isPlaying ? (
                <>
                  <p className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                    {currentStep.label}
                  </p>
                  <p className="text-white/90 text-xs md:text-sm font-medium tracking-wider uppercase bg-black/20 px-3 py-1 rounded-full inline-block">
                    {currentStep.instruction}
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <Play className="w-8 h-8 md:w-10 md:h-10 text-white mb-2 opacity-80" />
                  <p className="text-xl md:text-2xl font-semibold text-white">Ready?</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center gap-6">
            <button
              onClick={handleToggle}
              className="px-8 md:px-12 py-3 md:py-4 bg-white text-gray-900 hover:bg-gray-100 rounded-2xl font-bold text-base md:text-lg shadow-lg shadow-white/5 hover:-translate-y-1 transition-all flex items-center space-x-3"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>{cycles > 0 ? 'Resume' : 'Start'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="p-3 md:p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-2xl text-gray-400 hover:text-white transition-all"
              title="Reset Session"
            >
              <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700/50">
            <Activity className="w-4 h-4 text-blue-400" />
            <span>Completed Cycles: <span className="text-white font-mono font-bold ml-1">{cycles}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};
const Breathing = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);

  return (
    <div className="h-full bg-gray-900 overflow-y-auto">
      {!selectedExercise ? (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Breathe & Center
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Scientific breathing techniques to hack your nervous system. Select a pattern below to begin your session.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {breathingExercises.map((exercise) => (
              <BreathingExerciseCard
                key={exercise.id}
                exercise={exercise}
                onStart={() => setSelectedExercise(exercise)}
              />
            ))}
          </div>
        </div>
      ) : (
        <BreathingSession
          exercise={selectedExercise}
          onBack={() => setSelectedExercise(null)}
        />
      )}
    </div>
  );
};

export default Breathing;