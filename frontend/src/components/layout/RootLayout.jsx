import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Mic2, Disc, LogOut, Music, Sparkles } from 'lucide-react';
import { useIsai } from '../../context/IsaiContext';
import { useAuth } from '../../context/AuthContext';

const NavItem = ({ icon: Icon, label, path, active }) => (
  <Link to={path}>
    <motion.div
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 ${
        active 
        ? 'bg-primary/20 text-primary border-r-4 border-primary shadow-[0_0_20px_rgba(249,115,22,0.15)] underline-none' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-slate-500'}`} />
      <span className="font-bold outfit tracking-wide uppercase text-sm">{label}</span>
    </motion.div>
  </Link>
);

export const RootLayout = ({ children }) => {
  const { currentUser: user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const isLoginPage = location.pathname === '/login';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Sidebar Toggle Button (Always visible) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-6 left-6 z-50 w-12 h-12 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center shadow-lg hover:border-primary/50 text-primary transition-all group"
      >
        <Music className={`w-6 h-6 transition-transform duration-500 ${isSidebarOpen ? 'rotate-12' : 'rotate-0'}`} />
        <div className="absolute left-14 bg-slate-900 border border-white/10 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          {isSidebarOpen ? 'Close Node' : 'Open Node'}
        </div>
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-72 border-r border-white/5 glass-card hidden lg:flex flex-col h-screen fixed top-0 z-40 bg-background/80 backdrop-blur-xl"
          >
            <div className="p-10 pb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                <Music className="text-white w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black outfit tracking-tighter">
                ISAICRAFT<span className="text-primary prose-xl">.</span>
              </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-8">
              <NavItem icon={LayoutDashboard} label="Dashboard" path="/" active={location.pathname === '/'} />
              <NavItem icon={Mic2} label="Studio" path="/studio" active={location.pathname === '/studio'} />
              <NavItem icon={Disc} label="Mastering" path="/results" active={location.pathname === '/results'} />
            </nav>

            <div className="p-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-bold outfit text-sm uppercase">Sign Out</span>
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main 
        animate={{ 
          paddingLeft: isSidebarOpen ? '18rem' : '2.5rem',
          transition: { type: 'spring', damping: 25, stiffness: 200 }
        }}
        className="flex-1 min-w-0 p-6 lg:p-10 relative"
      >
        {/* Top bar */}
        <div className="flex justify-between items-center mb-10 pl-16 lg:pl-0">
          <div>
            <h2 className="text-sm font-mono text-primary/80 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> System Online • v1.0.4
            </h2>
          </div>
          <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold outfit">{user?.displayName || user?.email?.split('@')[0] || 'Elite Producer'}</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Premium Node</span>
              </div>
             <div className="w-10 h-10 rounded-full border border-primary/40 p-0.5">
               <img src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="Avatar" className="rounded-full w-full h-full object-cover"/>
             </div>
          </div>
        </div>

        {/* Page Content with Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
};
