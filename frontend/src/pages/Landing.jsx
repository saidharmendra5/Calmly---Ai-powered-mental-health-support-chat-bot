import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from 'framer-motion';
import { Shield, Lock, Sparkles, Heart, ArrowRight, Activity, Zap, CheckCircle2 } from 'lucide-react';

/**
 * UTILITIES
 * Basic math helpers for the generative animation
 */
const lerp = (start, end, t) => start * (1 - t) + end * t;
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

/**
 * COMPONENT: CHAOS TO CALM CANVAS
 * The core visual metaphor: Particles transition from erratic noise to harmonic flow.
 */
/**
 * COMPONENT: PERMANENTLY CALM CANVAS
 * The exact visuals of the original, but locked to the "Calm" state.
 */
/**
 * COMPONENT: CLEAN CANVAS (No Trails)
 * Same particles, but the background is wiped clean every frame.
 */
const HeroCanvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    // Configuration
    const particleCount = 150;
    const connectionDistance = 100;

    // Initialize Particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        phase: Math.random() * Math.PI * 2
      });
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const render = () => {
      // 1. CLEAR CANVAS COMPLETELY
      // This is the fix. 'clearRect' removes everything from the previous frame.
      // No ghosting, no trails.
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // (Optional) If you want a solid background color behind the dots:
      // ctx.fillStyle = 'rgb(15, 23, 42)'; // Solid slate-950
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        // 2. PHYSICS (Calm harmonic motion)
        const currentVx = Math.sin(Date.now() * 0.001 + p.phase) * 0.5;
        const currentVy = Math.cos(Date.now() * 0.001 + p.phase) * 0.5;

        p.x += currentVx;
        p.y += currentVy;

        // Boundary wrapping
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // 3. DRAW PARTICLES
        const color = `rgba(255, 255, 255, 0.88)`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // 4. DRAW CONNECTIONS
        particles.forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const lineOpacity = (1 - dist / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255,255,255, ${lineOpacity})`;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0">
      <canvas ref={canvasRef} className="w-full h-full" />
      {/* Overlay Gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/60 to-slate-900" />
    </div>
  );
};

/**
 * COMPONENT: EXTENDED CHAT DEMO (No Scrollbar)
 */
const ChatDemo = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: "Hi. I'm here. No judgment, just listening. How is your mind feeling right now?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const script = [
    { role: 'user', text: "Honestly? I feel like I'm drowning in my to-do list." },
    { role: 'ai', text: "That sounds incredibly heavy. When everything feels urgent, it's hard to breathe. Want to try breaking just one small thing off that list together?" },
    { role: 'user', text: "Maybe... I could start with the emails. There are just so many." },
    { role: 'ai', text: "Emails are a great start. Let's not worry about all of them. Can we just open three? No pressure to reply yet. How does that feel?" }
  ];

  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);

      let timeout;
      const runScript = async () => {
        // --- EXCHANGE 1 ---
        await new Promise(r => setTimeout(r, 1500));
        setMessages(prev => [...prev, script[0]]);

        setIsTyping(true);
        await new Promise(r => setTimeout(r, 1500));
        setIsTyping(false);
        setMessages(prev => [...prev, script[1]]);

        // --- EXCHANGE 2 ---
        await new Promise(r => setTimeout(r, 2000));
        setMessages(prev => [...prev, script[2]]);

        setIsTyping(true);
        await new Promise(r => setTimeout(r, 1800));
        setIsTyping(false);
        setMessages(prev => [...prev, script[3]]);
      };

      runScript();
      return () => clearTimeout(timeout);
    }
  }, [isInView, hasStarted]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-md mx-auto bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-50" />

      {/* Added 'scrollbar-hide' class here */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed
                ${m.role === 'user'
                  ? 'bg-blue-600/80 text-white rounded-br-none'
                  : 'bg-white/5 text-slate-200 border border-white/5 rounded-bl-none'}
              `}>
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-1 ml-4"
          >
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </motion.div>
        )}
        <div className="h-1" />
      </div>
    </div>
  );
};
/**
 * COMPONENT: TRUST BADGE
 * Simple, calming, authoritative.
 */
const TrustBadge = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
    <Icon className="w-4 h-4 text-emerald-400" />
    <span className="text-xs font-medium text-slate-300 tracking-wide uppercase">{text}</span>
  </div>
);

/**
 * MAIN APP COMPONENT
 */
export default function MentalHealthLanding() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-purple-500/30 font-sans overflow-x-hidden">

      {/* 1. CINEMATIC BACKGROUND */}
      <HeroCanvas />

      {/* 2. NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Calmly</span>
        </div>
        <button onClick={() => navigate('/login')} className="px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm font-medium backdrop-blur-md">
          Member Login
        </button>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20">
        <motion.div
          style={{ opacity: opacityFade }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >

          <div className="w-[1px] h-12 bg-gradient-to-b from-slate-500 to-transparent" />
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex justify-center gap-4 mb-8"
          >
            <TrustBadge icon={Shield} text="Private & Encrypted" />
            <TrustBadge icon={Activity} text="Clinically Informed" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 leading-[1.1]"
          >
            Find quiet in <br />
            <span className="italic font-light text-slate-400">the noise.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed"
          >
            An intelligent companion that understands your emotions,
            respects your privacy, and helps you navigate life’s complexities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <button onClick={() => navigate('/register')} className="group relative px-8 py-4 bg-white text-slate-900 rounded-full font-semibold transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              Start Feeling Better
              <span className="absolute inset-0 rounded-full ring-2 ring-white ring-offset-2 ring-offset-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button onClick={() => navigate('/register')} className="px-8 py-4 rounded-full text-slate-300 hover:text-white transition-colors flex items-center gap-2 group">
              See how it works
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 4. THE EXPERIENCE (How It Helps) */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

          <div className="order-2 lg:order-1 space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-semibold text-white">
                Conversation, <br />
                <span className="text-slate-500">not interrogation.</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                Traditional journaling can feel lonely. Therapy can be expensive.
                Calmly fills the gap with an AI that listens without bias and
                guides without pressure.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { title: "Vent Freely", desc: "Release your thoughts in a judgment-free zone." },
                { title: "Gain Clarity", desc: "AI gently helps you spot patterns in your thinking." },
                { title: "Decompress", desc: "Guided breathing and grounding techniques on demand." }
              ].map((item, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  key={i}
                  className="flex gap-4 group cursor-default"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-slate-200">{item.title}</h3>
                    <p className="text-slate-500">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            {/* The "High-End" Interactive Demo */}
            <ChatDemo />
          </div>

        </div>
      </section>

      {/* 5. PRIVACY & SAFETY (The "Trust Layer") */}
      <section className="relative z-10 py-24 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold">Your secrets stay yours.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We built Calmly with a privacy-first architecture. We don't sell data,
              and conversations are encrypted end-to-end.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: "End-to-End Encrypted", text: "Only you can see your chats." },
              { icon: Zap, title: "Local Processing", text: "Sensitive analysis happens on your device." },
              { icon: Heart, title: "Human First", text: "Designed by psychologists, not just engineers." }
            ].map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all"
              >
                <card.icon className="w-10 h-10 text-slate-400 mb-6 mx-auto" />
                <h3 className="text-lg font-medium mb-3">{card.title}</h3>
                <p className="text-sm text-slate-500">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL EMOTIONAL CTA */}
      <section className="relative z-10 py-40 px-6 text-center">
        {/* Ambient background glow for this section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-10">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            You don't have to <br />
            navigate this alone.
          </h2>
          <p className="text-xl text-slate-400">
            Start your journey to a calmer mind today. Free forever for basic support.
          </p>
          <button onClick={() => navigate('/register')} className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-lg font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:scale-105 transition-all">
            Talk to Calmly Now
          </button>

          <p className="text-sm text-slate-600 pt-8">
            *Calmly is a support tool, not a replacement for professional clinical therapy. <br />
            If you are in crisis, please call emergency services.
          </p>
        </div>
      </section>
      {/* Add this at the bottom of your main component's return JSX */}
      <style>{`
  /* Hide scrollbar for Chrome, Safari and Opera */
  .scrollbar-hide::-webkit-scrollbar,
  body::-webkit-scrollbar,
  html::-webkit-scrollbar {
      display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .scrollbar-hide, body, html {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
  }
`}</style>

    </div>
  );
}