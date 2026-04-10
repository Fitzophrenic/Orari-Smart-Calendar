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
        <header className='bg-black text-white relative p-4 min-w-full w-screen'>
          <div className='flex items-center w-full'>
            <h1 className='text-lg font-bold'>Orari</h1>
            {/*buttons*/ }
            <div className='ml-auto flex gap-2'>
              <button className='rounded border border-white/40 px-3 py-1 text-sm text-white transition hover:bg-white/10'>Login</button>
              <button className='rounded bg-white px-3 py-1 text-sm font-semibold text-black transition hover:bg-white/90'>Sign Up</button>
            </div>
          </div>
             {/*divider*/ }
          <hr className='my-4 border-white/20' />
          {/*top text*/ }
          <div className='text-sm text-white/80'>{activeItem.label}</div>
        </header>
        <div className='flex flex-1'>
          <nav className='hidden md:flex flex-col bg-gray-100 w-48 p-4'>
            {navItems.map((item) => (
              <div key={item.path} className='mb-2'>
                   {/*links*/ }
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `block ${isActive ? 'font-bold text-black' : 'text-slate-600 hover:text-black'}`
                  }
                >
                  {item.label}
                </NavLink>
              </div>
            ))}
          </nav>
          <main className='flex-1 p-4'>
            <ContentBox />
            <Routes>
              <Route path='/' element={<Calendar />} />
              <Route path='/categories' element={<Categories />} />
              <Route path='/suggestions' element={<Suggestions />} />
              <Route path='/alerts' element={<Alerts />} />
              <Route path='/profile' element={<Profile />} />
            </Routes>
          </main>
        </div>
      </div>
    );
}

function ContentBox() {
  return (
    <div className="flex h-[300px] w-full items-center justify-center border-2 border-dashed border-gray-400 bg-gray-200">
      <p className="text-gray-700 font-medium">Tailwind is now active!</p>
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
