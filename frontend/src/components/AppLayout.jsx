import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, Wind, Book, User, PlusCircle, Menu, X, LogOut, Brain, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Helper to check current chat ID
  const currentChatId = location.pathname.split('/app/chat/')[1];

  const navItems = [
    { path: '/app/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/app/breathing', icon: Wind, label: 'Breathing' },
    { path: '/app/books', icon: Book, label: 'Books' },
    { path: '/app/profile', icon: User, label: 'Profile' },
  ];

  // Fetch chats from Backend
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:5000/api/chats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setChats(data);
        } else {
          console.error("Failed to fetch chats");
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchChats();
  }, [user, location.pathname]); // Re-fetch or re-render when path changes helps keep order correct

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate('/');
  };

  const openChat = (chatId) => {
    navigate(`/app/chat/${chatId}`);
    // Optional: setSidebarOpen(false) on mobile
  };

  const handleNewChat = () => {
    navigate('/app/chat');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-0'
          } bg-gray-950 border-r border-gray-800 transition-all duration-300 flex flex-col overflow-hidden`}
      >
        {/* 1. COMPACT HEADER */}
        <div className="p-3 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-base">Calmly</span>
          </div>
        </div>

        {/* 2. NEW CHAT BUTTON */}
        <div className="p-3 flex-shrink-0">
          <button
            onClick={handleNewChat}
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 group"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* 3. SCROLLABLE RECENT CHATS (Hidden Scrollbar) */}
        <div className="flex-1 overflow-y-auto px-3 py-1 min-h-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <div className="mb-2">
            <h3 className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 px-2 font-semibold">Recent Chats</h3>
            <div className="space-y-0.5">
              {isLoading ? (
                <div className="flex justify-center p-2 text-gray-500">
                  <Loader className="w-4 h-4 animate-spin" />
                </div>
              ) : chats.length > 0 ? (
                chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => openChat(chat.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-md transition-colors text-xs truncate
                      ${currentChatId === String(chat.id)
                        ? 'bg-gray-800 text-white border border-gray-700'
                        : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
                      }`}
                  >
                    {chat.title || 'Untitled Chat'}
                  </button>
                ))
              ) : (
                <p className="px-3 text-[10px] text-gray-600 italic">No recent chats</p>
              )}
            </div>
          </div>
        </div>

        {/* 4. FIXED NAVIGATION (Bottom Left) */}
        <div className="p-3 border-t border-gray-800 flex-shrink-0 bg-gray-950 z-10">
          <h3 className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 px-2 font-semibold">Navigation</h3>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              // Highlight if path matches OR if it's a sub-route of chat
              const isActive = location.pathname === item.path || (item.path === '/app/chat' && location.pathname.startsWith('/app/chat/'));

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-1.5 rounded-md transition-all text-xs ${isActive
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'hover:bg-gray-900 text-gray-400 hover:text-gray-200'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 5. COMPACT USER PROFILE FOOTER */}
        <div className="p-3 border-t border-gray-800 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-3 px-1">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-2 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-md transition-all text-xs"
          >
            <LogOut className="w-3 h-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="text-sm text-gray-400">
            {navItems.find(item => item.path === location.pathname)?.label || 'Calmly'}
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;