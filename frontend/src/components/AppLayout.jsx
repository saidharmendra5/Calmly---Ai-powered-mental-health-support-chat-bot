// import { useState } from 'react';
// import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
// import { MessageCircle, Wind, Book, User, PlusCircle, Menu, X, LogOut, Brain } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { recentChats } from '../data/mockData';

// const AppLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { logout, user } = useAuth();

//   const navItems = [
//     { path: '/app/chat', icon: MessageCircle, label: 'Chat' },
//     { path: '/app/breathing', icon: Wind, label: 'Breathing' },
//     { path: '/app/books', icon: Book, label: 'Books' },
//     { path: '/app/profile', icon: User, label: 'Profile' },
//   ];

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     logout();
//     navigate('/');
//   };

//   return (
//     <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
//       <aside
//         className={`${sidebarOpen ? 'w-64' : 'w-0'
//           } bg-gray-950 border-r border-gray-800 transition-all duration-300 flex flex-col overflow-hidden`}
//       >
//         <div className="p-4 border-b border-gray-800 flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <Brain className="w-6 h-6 text-blue-400" />
//             <span className="font-bold text-lg">Calmly</span>
//           </div>
//         </div>

//         <div className="p-4">
//           <button
//             onClick={() => navigate('/app/chat')}
//             className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 group"
//           >
//             <PlusCircle className="w-5 h-5" />
//             <span>New Chat</span>
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto px-4 py-2">
//           <div className="mb-6">
//             <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2">Recent Chats</h3>
//             <div className="space-y-1">
//               {recentChats.map((chat) => (
//                 <button
//                   key={chat.id}
//                   className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm text-gray-300 hover:text-white truncate"
//                 >
//                   {chat.title}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="mb-6">
//             <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2">Navigation</h3>
//             <div className="space-y-1">
//               {navItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = location.pathname === item.path;
//                 return (
//                   <Link
//                     key={item.path}
//                     to={item.path}
//                     className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${isActive
//                       ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
//                       : 'hover:bg-gray-800 text-gray-300 hover:text-white'
//                       }`}
//                   >
//                     <Icon className="w-5 h-5" />
//                     <span>{item.label}</span>
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         <div className="p-4 border-t border-gray-800">
//           <div className="flex items-center space-x-3 mb-3 px-2">
//             <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//               <User className="w-4 h-4" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
//               <p className="text-xs text-gray-500 truncate">{user?.email}</p>
//             </div>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-all"
//           >
//             <LogOut className="w-4 h-4" />
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>

//       <div className="flex-1 flex flex-col overflow-hidden">
//         <header className="h-16 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-6">
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
//           >
//             {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//           <div className="text-sm text-gray-400">
//             {navItems.find(item => item.path === location.pathname)?.label || 'Calmly'}
//           </div>
//         </header>

//         <main className="flex-1 overflow-hidden">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AppLayout;


import { useState, useEffect } from 'react'; // 1. Import useEffect
import { Outlet, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { MessageCircle, Wind, Book, User, PlusCircle, Menu, X, LogOut, Brain, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// Removed: import { recentChats } from '../data/mockData'; 

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 2. Add state for chats and loading status
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Helper to check if we are on a specific chat ID (useful for highlighting)
  // Assuming your route is /app/chat/:chatId
  const currentChatId = location.pathname.split('/app/chat/')[1];

  const navItems = [
    { path: '/app/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/app/breathing', icon: Wind, label: 'Breathing' },
    { path: '/app/books', icon: Book, label: 'Books' },
    { path: '/app/profile', icon: User, label: 'Profile' },
  ];

  // 3. Fetch chats from Backend
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        // Replace with your actual Backend API endpoint
        const response = await fetch('http://localhost:5000/api/chats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setChats(data); // Assuming data is an array of chat objects
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
  }, [user]); // Re-run if user changes

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate('/');
  };

  // 4. Handle clicking a specific chat
  const openChat = (chatId) => {
    navigate(`/app/chat/${chatId}`);
    // On mobile, you might want to auto-close sidebar here:
    // setSidebarOpen(false); 
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
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-blue-400" />
            <span className="font-bold text-lg">Calmly</span>
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 group"
          >
            <PlusCircle className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2">Recent Chats</h3>

            <div className="space-y-1">
              {isLoading ? (
                <div className="flex justify-center p-4 text-gray-500">
                  <Loader className="w-5 h-5 animate-spin" />
                </div>
              ) : chats.length > 0 ? (
                chats.map((chat) => (
                  <button
                    key={chat.id} // or chat._id depending on DB
                    onClick={() => openChat(chat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm truncate
                      ${currentChatId === String(chat.id)
                        ? 'bg-gray-800 text-white border border-gray-700'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                  >
                    {chat.title || 'Untitled Chat'}
                  </button>
                ))
              ) : (
                <p className="px-3 text-xs text-gray-500 italic">No recent chats</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2">Navigation</h3>
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                // Check if path matches exactly OR if we are in a sub-route (like /app/chat/123)
                const isActive = location.pathname === item.path || (item.path === '/app/chat' && location.pathname.startsWith('/app/chat/'));

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${isActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 mb-3 px-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="text-sm text-gray-400">
            {/* Dynamic Header Label */}
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