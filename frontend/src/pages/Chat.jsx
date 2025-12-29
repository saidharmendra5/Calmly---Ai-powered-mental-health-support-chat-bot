import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const Chat = () => {
  const { chatId } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // 1. Fetch Chat History when URL changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (!chatId) {
        setMessages([]); // Reset for new chat
        return;
      }

      setIsLoadingHistory(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/chats/${chatId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Ensure data.messages matches your backend structure
          setMessages(data.messages || []);
        } else {
          console.error("Failed to load chat history");
        }
      } catch (error) {
        console.error("Error loading chat:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [chatId]);

  // 2. Handle Sending Messages
  // inside Chat.jsx

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    setInput(''); // Clear input

    // 1. Optimistic Update (Show user message immediately)
    const tempUserMessage = {
      id: Date.now(),
      role: 'user',
      content: currentInput,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, tempUserMessage]);
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");

      // 2. DECISION: Are we in a new chat or existing chat?
      // If chatId exists in URL -> Use "append message" endpoint
      // If NO chatId -> Use "create chat" endpoint
      const endpoint = chatId
        ? `http://localhost:5000/api/chats/${chatId}/message`
        : `http://localhost:5000/api/chats`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: currentInput })
      });

      if (!response.ok) throw new Error('Failed to send');

      const data = await response.json();

      // 3. Add AI Response to UI
      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

      // 4. CRITICAL FIX: If this was a NEW chat, update the URL!
      // This tells React: "We are now in chat ID 123, not a new chat anymore"
      if (!chatId && data.chatId) {
        navigate(`/app/chat/${data.chatId}`, { replace: true });
      }

    } catch (error) {
      console.error("Error:", error);
      // Add error handling UI here
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
          <div className="max-w-4xl mx-auto px-4 py-8">
            {messages.length === 0 && !chatId && (
              <div className="text-center text-gray-500 mt-20">
                <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h2 className="text-xl font-semibold mb-2">How can I help you today?</h2>
                <p className="text-sm">I'm here to listen and support you.</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 mb-6 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                    : 'bg-gradient-to-br from-green-500 to-emerald-500'
                    }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>

                <div
                  className={`flex-1 max-w-3xl ${message.role === 'user' ? 'flex justify-end' : ''
                    }`}
                >
                  <div
                    className={`px-5 py-4 rounded-2xl ${message.role === 'user'
                      ? 'bg-blue-500/20 border border-blue-500/30 text-white'
                      : 'bg-gray-800/50 border border-gray-700 text-gray-100'
                      }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 px-2">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 max-w-3xl">
                  <div className="px-5 py-4 rounded-2xl bg-gray-800/50 border border-gray-700">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSend} className="flex items-end gap-3">
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
                className="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-gray-500 resize-none max-h-32"
                rows="1"
                style={{
                  minHeight: '56px',
                  height: 'auto',
                  overflowY: input.split('\n').length > 3 ? 'auto' : 'hidden'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isTyping} // Disable while bot is thinking
              className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </form>
          <p className="text-xs text-gray-600 mt-3 text-center">
            This is a safe space. Your conversations are private and encrypted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;