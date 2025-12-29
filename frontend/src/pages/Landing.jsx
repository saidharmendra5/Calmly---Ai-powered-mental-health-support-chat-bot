import { useNavigate } from 'react-router-dom';
import { Brain, Shield, Book, Wind, MessageCircle, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const Landing = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: MessageCircle,
      title: 'Emotion-Aware Chat',
      description: 'AI-powered conversations that understand and respond to your emotional state'
    },
    {
      icon: Wind,
      title: 'Breathing Exercises',
      description: 'Guided breathing techniques to help you relax and find inner peace'
    },
    {
      icon: Book,
      title: 'Book Recommendations',
      description: 'Curated reading materials to support your mental health journey'
    },
    {
      icon: Shield,
      title: 'Private & Secure',
      description: 'Your conversations are confidential and protected with end-to-end encryption'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 50%)`
        }}
      />

      <div className="floating-shapes absolute inset-0 overflow-hidden pointer-events-none">
        <div className="shape shape-1 absolute w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-float" style={{ top: '10%', left: '10%' }} />
        <div className="shape shape-2 absolute w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float-delayed" style={{ top: '50%', right: '10%' }} />
        <div className="shape shape-3 absolute w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-float-slow" style={{ bottom: '10%', left: '30%' }} />
      </div>

      <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Brain className="w-8 h-8 text-blue-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Calmly
          </span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all duration-300 border border-white/20"
        >
          Login
        </button>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center space-y-8 mb-32">
          <div className="inline-block animate-fade-in">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <span className="text-sm uppercase tracking-wider text-blue-400 font-semibold">
                Your Safe Space for Mental Wellbeing
              </span>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold leading-tight animate-fade-in-up">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Mental Health
            </span>
            <br />
            <span className="text-white">Matters</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            A compassionate AI companion for emotional support, mindfulness, and personal growth.
            Available 24/7 to listen, understand, and guide you through life's challenges.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
            <button
              onClick={() => navigate('/register')}
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Get Started Free
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-12 border border-white/10 text-center animate-fade-in">
          <Shield className="w-16 h-16 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Privacy & Safety First</h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-6">
            Your mental health journey is deeply personal. We use end-to-end encryption to ensure
            your conversations remain completely confidential. Your trust is our priority.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>End-to-End Encrypted</span>
            </span>
            <span className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>HIPAA Compliant</span>
            </span>
            <span className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Anonymous Sessions</span>
            </span>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          <p>© 2024 Calmly. Supporting your mental wellness journey.</p>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 25s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-float-slow {
          animation: float 30s ease-in-out infinite;
          animation-delay: 4s;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
          animation-fill-mode: both;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default Landing;
