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
          
         
            
<div className="w-full">
  <Routes>
    <Route path='/' element={<Calendar />} />
    <Route path='/categories' element={<Categories />} />
    <Route path='/suggestions' element={<Suggestions />} />
    <Route path='/alerts' element={<Alerts />} />
    <Route path='/profile' element={<Profile />} />
  </Routes>
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
