import { useState } from 'react';
import { FiMenu, FiHome, FiPlus, FiSearch, FiX } from 'react-icons/fi';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchToggle = () => {
    setSearchActive(!searchActive);
    if (searchActive) {
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-[#DB4C3F] text-white h-12 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          className="text-xl hover:bg-[#c73c2e] p-1 rounded transition-colors"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <FiMenu />
        </button>
        <button className="text-xl hover:bg-[#c73c2e] p-1 rounded transition-colors" aria-label="Home">
          <FiHome />
        </button>
      </div>

      <div className={`flex-1 max-w-xl transition-all duration-300 ease-in-out ${searchActive ? 'mx-4' : 'mx-0'}`}>
        {searchActive ? (
          <div className="relative w-full">
            <input
              type="text"
              className="bg-[#e27065] text-white placeholder-[#f5c4bd] px-10 py-1 rounded w-full focus:outline-none focus:bg-[#ffffff] focus:text-gray-800"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#f5c4bd]" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#f5c4bd] hover:text-white"
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1" />
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          className="text-xl hover:bg-[#c73c2e] p-1 rounded transition-colors"
          onClick={handleSearchToggle}
          aria-label={searchActive ? "Close Search" : "Open Search"}
        >
          {searchActive ? <FiX /> : <FiSearch />}
        </button>
        <button
          className="text-xl hover:bg-[#c73c2e] p-1 rounded transition-colors"
          aria-label="Add Task"
        >
          <FiPlus />
        </button>
      </div>
    </header>
  );
}
