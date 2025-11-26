import { Search, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TopNavProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentArtist: string;
  allArtists: string[];
  onArtistClick: (artist: string) => void;
}

export function TopNav({ searchQuery, onSearchChange, currentArtist, allArtists, onArtistClick }: TopNavProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll to current artist when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current) {
      const currentIndex = allArtists.indexOf(currentArtist);
      if (currentIndex >= 0) {
        // Scroll to show current artist at top (each item is roughly 44px tall)
        dropdownRef.current.scrollTop = currentIndex * 44;
      }
    }
  }, [isDropdownOpen, currentArtist, allArtists]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black to-transparent">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-8">
          <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
            About
          </a>
        </div>

        {/* Center - Current Artist Name with dropdown */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <div className="relative">
            <button className="flex items-center gap-2 hover:text-white transition-colors group">
              <h1 
                key={currentArtist}
                className="text-4xl text-gray-600 group-hover:text-gray-400 tracking-wide animate-in fade-in slide-in-from-bottom-2 duration-700 transition-colors"
              >
                {currentArtist}
              </h1>
              <ChevronDown 
                className={`w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-all duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu with hover bridge */}
            {isDropdownOpen && (
              <>
                {/* Invisible hover bridge to prevent gap issues */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-full h-4" />
                
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-black/95 border border-white/10 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 min-w-[320px] max-h-[60vh] overflow-y-auto" ref={dropdownRef}>
                  {allArtists.map((artist) => (
                    <button
                      key={artist}
                      onClick={() => {
                        onArtistClick(artist);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 hover:bg-white/10 transition-colors ${
                        artist === currentArtist ? 'bg-white/5 text-white' : 'text-gray-300'
                      }`}
                    >
                      {artist}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search... (Try: artist:pearl jam, song:alive, type:soundboard)"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-black/70 border border-white/20 text-white placeholder-gray-400 rounded px-4 py-2 pl-10 w-96 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            
            {/* Search hint tooltip */}
            <div className="absolute top-full right-0 mt-2 bg-black/95 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-400 w-72 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
              <div className="mb-1 text-white">Field filters:</div>
              <div className="space-y-0.5 font-mono">
                <div><span className="text-gray-500">artist:</span> pearl jam</div>
                <div><span className="text-gray-500">song:</span> alive</div>
                <div><span className="text-gray-500">type:</span> soundboard</div>
                <div><span className="text-gray-500">country:</span> usa</div>
                <div><span className="text-gray-500">year:</span> 1999</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}