import React, { useState, useEffect, createContext, useContext } from 'react';
import { UserRole, User } from './types.ts';
import LandingPage from './components/LandingPage.tsx';
import AuthPage from './components/AuthPage.tsx';
import {DonorDashboard} from './components/DonorDashboard.tsx';
import ReceiverDashboard from './components/ReceiverDashboard.tsx';
import NGODashboard from './components/NGODashboard.tsx';
import GovDashboard from './components/GovDashboard.tsx';
import Navbar from './components/Navbar.tsx';
import LiveNotifications from './components/LiveNotifications.tsx';
// --- NEW IMPORT ADDED BELOW ---
import { Chatbot } from './components/Chatbot.tsx'; 

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('medroute_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (email: string, role: UserRole) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role
    };
    setUser(newUser);
    localStorage.setItem('medroute_user', JSON.stringify(newUser));
    setShowAuth(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medroute_user');
  };

  const renderDashboard = () => {
    if (!user) return <LandingPage onAuth={() => setShowAuth(true)} />;
    
    switch (user.role) {
      case UserRole.DONOR: return <DonorDashboard />;
      case UserRole.RECEIVER: return <ReceiverDashboard />;
      case UserRole.NGO: return <NGODashboard />;
      case UserRole.GOVERNMENT: return <GovDashboard />;
      default: return <LandingPage onAuth={() => setShowAuth(true)} />;
    }
  };

  const scrollToSection = (id: string) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div className="min-h-screen flex flex-col bg-slate-50 relative">
        <Navbar onAuth={() => setShowAuth(true)} />
        
        <main className="flex-grow">
          {showAuth && !user ? (
            <AuthPage onBack={() => setShowAuth(false)} />
          ) : (
            renderDashboard()
          )}
        </main>

        <footer className="bg-slate-900 text-white pt-24 pb-12 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 pb-20 border-b border-white/10">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="10" width="16" height="8" rx="2" />
                      <path d="M18 18h2a2 2 0 0 0 2-2v-4l-4-3h-2" />
                      <circle cx="7" cy="18" r="2" />
                      <circle cx="17" cy="18" r="2" />
                    </svg>
                    <div className="absolute -top-1 -right-1 bg-white text-indigo-600 rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-black border border-indigo-600">+</div>
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter">MedRoute</h3>
                </div>
                <p className="text-slate-400 font-medium leading-relaxed text-lg">
                  Transforming unused medicines into life-saving resources through smart redistribution.
                </p>
              </div>

              <div>
                <h4 className="text-indigo-400 font-black uppercase tracking-widest text-[11px] mb-8">Quick Links</h4>
                <ul className="space-y-4 font-bold text-slate-300">
                  <li><button onClick={() => scrollToSection('home')} className="hover:text-white transition">Home</button></li>
                  <li><button onClick={() => setShowAuth(true)} className="hover:text-white transition">Donate Medicines</button></li>
                  <li><button onClick={() => setShowAuth(true)} className="hover:text-white transition">Request Medicines</button></li>
                  <li><button onClick={() => scrollToSection('partners')} className="hover:text-white transition">About Us</button></li>
                </ul>
              </div>

              <div>
                <h4 className="text-indigo-400 font-black uppercase tracking-widest text-[11px] mb-8">For Organizations</h4>
                <ul className="space-y-4 font-bold text-slate-300">
                  <li><button onClick={() => setShowAuth(true)} className="hover:text-white transition">NGO Portal</button></li>
                  <li><button onClick={() => setShowAuth(true)} className="hover:text-white transition">Government Dashboard</button></li>
                  <li><button className="hover:text-white transition">API Access</button></li>
                  <li><button className="hover:text-white transition">Become a Partner</button></li>
                </ul>
              </div>

              <div>
                <h4 className="text-indigo-400 font-black uppercase tracking-widest text-[11px] mb-8">Contact & Legal</h4>
                <ul className="space-y-4 font-bold text-slate-300">
                  <li className="text-white">contact@medroute.org</li>
                  <li className="text-slate-400">+91 123-456-7890</li>
                  <li><button className="hover:text-white transition">Terms of Service</button></li>
                  <li><button className="hover:text-white transition">Privacy Policy</button></li>
                </ul>
              </div>
            </div>

            <div className="mt-16 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
              <div className="max-w-md w-full">
                <h4 className="font-black uppercase tracking-widest text-[10px] text-indigo-400 mb-4">Subscribe to updates</h4>
                <div className="flex gap-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-grow bg-slate-800 border-none rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-indigo-600 transition outline-none font-medium"
                  />
                  <button className="px-8 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/20">
                    Join
                  </button>
                </div>
              </div>
              <div className="text-slate-500 font-bold text-sm tracking-widest uppercase">
                © 2026 MedRoute Network. Powered by Intelligent AI.
              </div>
            </div>
          </div>
        </footer>

        {/* --- CHATBOT INTEGRATED BELOW --- */}
        <LiveNotifications />
        <Chatbot /> 
      </div>
    </AuthContext.Provider>
  );
};

export default App;