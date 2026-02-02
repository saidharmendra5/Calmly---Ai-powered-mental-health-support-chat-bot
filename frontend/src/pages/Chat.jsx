import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

// --- Typewriter Component ---
// TODO : FIX THE TYPE WRITER BUG : SECOND CHAR IS BEING OMITTED FROM MESSAGES
const Typewriter = ({ text, speed = 20 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index === text.length) {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <p className="whitespace-pre-wrap leading-relaxed text-sm">{displayedText}</p>;
};

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();

  // State Management
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // New State: User Location
  const [userLocation, setUserLocation] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // 1. Fetch User Location on Mount (High Accuracy Mode)
  useEffect(() => {
    if ("geolocation" in navigator) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("High accuracy location acquired:", position.coords.accuracy, "meters");
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Location error:", error.message);
        },
        options
      );
    }
  }, []);

  // 2. Fetch Chat History
  useEffect(() => {
    const fetchHistory = async () => {
      if (!chatId) {
        setMessages([]);
        return;
      }

      setIsLoadingHistory(true);
      try {
        const token = localStorage.getItem("token");

        // 🔥 FIX 1: Hardcoded Production URL to stop Localhost errors
        const API_BASE = "https://calmly-ai-powered-mental-health-support.onrender.com";

        const response = await fetch(`${API_BASE}/api/chats/${chatId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          const history = (data.messages || []).map(msg => ({ ...msg, shouldAnimate: false }));
          setMessages(history);
        }
      } catch (error) {
        console.error("Error loading chat:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [chatId]);

  // 3. Handle Sending
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    setInput('');

    const tempUserMessage = {
      id: Date.now(),
      role: 'user',
      content: currentInput,
      shouldAnimate: false
    };
    setMessages(prev => [...prev, tempUserMessage]);
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");

      // 🔥 FIX 2: Hardcoded Production URL here as well
      const API_BASE = "https://calmly-ai-powered-mental-health-support.onrender.com";

      const endpoint = chatId
        ? `${API_BASE}/api/chats/${chatId}/message`
        : `${API_BASE}/api/chats`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: currentInput,
          latitude: userLocation?.latitude || null,
          longitude: userLocation?.longitude || null
        })
      });

      if (!response.ok) throw new Error('Failed to send');

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.reply,
        shouldAnimate: true
      };

      setMessages(prev => [...prev, botMessage]);

      if (!chatId && data.chatId) {
        navigate(`/app/chat/${data.chatId}`, { replace: true });
      }

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex-1 overflow-y-auto">
        {isLoadingHistory ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <Loader className="w-8 h-8 animate-spin mb-2" />
            <p>Loading conversation...</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-6">

            {/* WELCOME SCREEN */}
            {messages.length === 0 && (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10">
                  <Bot className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">How can I help you today?</h2>
                <p className="text-gray-400 max-w-md">
                  I'm here to listen. Feel free to share your thoughts, feelings, or anything that's on your mind.
                </p>
              </div>
            )}

            {/* MESSAGES */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 mb-6 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${message.role === 'user'
                    ? 'bg-blue-600'
                    : 'bg-emerald-600'
                    }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`flex-1 max-w-3xl ${message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
                    }`}
                >
                  <div
                    className={`${message.role === 'user'
                      ? 'bg-blue-600/20 border border-blue-500/30 text-blue-50 rounded-tr-sm'
                      : 'bg-gray-800/80 border border-gray-700/50 text-gray-100 rounded-tl-sm'
                      } px-5 py-3 rounded-2xl shadow-sm`}
                  >
                    {message.role === 'assistant' && message.shouldAnimate ? (
                      <Typewriter text={message.content} />
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-800/80 border border-gray-700/50 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <form onSubmit={handleSend} className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Share what's on your mind..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-white placeholder-gray-500 resize-none text-sm"
                rows="1"
                style={{
                  minHeight: '44px',
                  maxHeight: '120px',
                  height: 'auto',
                  overflowY: input.split('\n').length > 3 ? 'auto' : 'hidden'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="
  h-[50px] w-[44px]
  flex items-center justify-center
  bg-gradient-to-r from-blue-500 to-purple-500
  rounded-xl
  hover:shadow-lg hover:shadow-blue-500/30
  transition-all
  disabled:opacity-50
  flex-shrink-0
  origin-top
  scale-y-[0.9]
"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
          <p className="text-[10px] text-gray-600 mt-2 text-center">
            Conversations are private.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;