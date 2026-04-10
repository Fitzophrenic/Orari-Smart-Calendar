import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Calendar from './pages/Calendar';
import Categories from './pages/Categories';
import Suggestions from './pages/Suggestions';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';

const navItems = [
  { path: '/', label: 'Calendar', short: 'Cal' },
  { path: '/categories', label: 'Categories', short: 'Cat' },
  { path: '/suggestions', label: 'Suggestions', short: 'Sug' },
  { path: '/alerts', label: 'Alerts', short: 'Alrt' },
  { path: '/profile', label: 'Profile', short: 'Prof' },
];

function AppContent() {
  const location = useLocation();
  const activeItem = navItems.find((item) => item.path === location.pathname) ?? navItems[0];

  return (
    <div className='flex flex-col min-h-screen'>
      {/* HEADER SECTION - Kept your original */}
      <header className='bg-black text-white p-4 w-full'>
        <div className='flex items-center w-full'>
          <h1 className='text-lg font-bold uppercase tracking-widest'>Orari</h1>
          <div className='ml-auto flex gap-2'>
            <button className='rounded border border-white/40 px-4 py-1 text-sm text-white transition hover:bg-white/10 uppercase font-bold'>Login</button>
            <button className='rounded bg-white px-4 py-1 text-sm font-bold text-black transition hover:bg-white/90 uppercase'>Sign Up</button>
          </div>
        </div>
        <hr className='my-4 border-white/20' />
        <div className='text-sm text-white/80'>{activeItem.label}</div>
      </header>

      <div className='flex flex-1 bg-white'>
        {/* SIDE NAV - Kept your original */}
        <nav className='hidden md:flex flex-col bg-gray-100 w-48 p-4 border-r border-gray-200'>
          {navItems.map((item) => (
            <div key={item.path} className='mb-2'>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `block p-2 rounded ${isActive ? 'bg-black text-white font-bold' : 'text-slate-600 hover:bg-gray-200'}`
                }
              >
                {item.label}
              </NavLink>
            </div>
          ))}
        </nav>

        {/* MAIN CONTENT AREA - THE WIREFRAME LAYOUT */}
        <main className='flex-1 p-10 flex flex-row items-start justify-between gap-10'>
          
          {/* LEFT COLUMN: Headlines & List */}
          <div className="flex-1 max-w-[500px] flex flex-col space-y-4">
            {/* Headline */}
            <div className="w-full h-16 bg-[#F3F4F6] border-2 border-black flex items-center px-4">
              <span className="font-bold text-gray-400">Headline Text</span>
            </div>
            {/* Description */}
            <div className="w-full h-32 bg-white border-2 border-black p-4">
              <span className="text-gray-400">Description Text</span>
            </div>
            {/* List Rows */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F3F4F6] border-2 border-black flex-shrink-0"></div>
                <div className="w-full h-10 border-2 border-black"></div>
              </div>
            ))}
            {/* CTA Button */}
            <button className="w-full h-14 bg-black text-white font-bold uppercase tracking-widest mt-4">
              Get Started
            </button>
          </div>

          {/* RIGHT COLUMN: The Box */}
          <div className="flex-1 flex justify-end">
            <ContentBox size="large" />
          </div>
            
        <div className="absolute bottom-10 left-10 pointer-events-none">
             {/* pointer-events-none ensures the 'ghost' box doesn't block clicks */}
             <div className="pointer-events-auto"> 
                <Routes>
                  <Route path='/' element={<Calendar />} />
                  <Route path='/categories' element={<Categories />} />
                  <Route path='/suggestions' element={<Suggestions />} />
                  <Route path='/alerts' element={<Alerts />} />
                  <Route path='/profile' element={<Profile />} />
                </Routes>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ContentBox({ size }) {
  const sizeClasses = {
    small: "w-1/4 h-32",
    medium: "w-1/2 h-64",
    large: "w-full aspect-[4/3] max-w-[550px]" // Changed to fill its container nicely
  };

  return (
    <div className={`
      flex items-center justify-center border-2 border-black bg-[#EFEFF3] rounded-sm 
      ${sizeClasses[size]}
    `}>
      <p className="text-gray-500 font-semibold italic text-center px-4">Hero Image / Illustration</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
