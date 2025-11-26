import { useState } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Show } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ShowCardProps {
  show: Show;
  onClick: () => void;
  focused?: boolean;
  getImageUrl?: (checksum: string, index: number) => string | null;
}

export function ShowCard({ show, onClick, focused = false, getImageUrl }: ShowCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const year = show.ShowDate ? show.ShowDate.split('-')[0] : 'Unknown';
  const durationMin = Math.floor(parseInt(show.DurationSec || '0') / 60);
  const hours = Math.floor(durationMin / 60);
  const minutes = durationMin % 60;
  const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  // Use ChecksumSHA1 for image path, fallback to placeholder
  const imageUrl = show.ChecksumSHA1 
    ? (getImageUrl ? getImageUrl(show.ChecksumSHA1, 1) : `/images/${show.ChecksumSHA1}_01.jpg`)
    : null;
  
  // Build display location
  const location = [show.City, show.Country].filter(Boolean).join(', ') || show.VenueName || 'Unknown';

  // Generate artist initials for placeholder
  const artistInitials = show.Artist
    .split(' ')
    .map(word => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Generate a consistent color based on artist name
  const getColorFromString = (str: string) => {
    const colors = [
      'bg-red-900',
      'bg-blue-900',
      'bg-green-900',
      'bg-purple-900',
      'bg-pink-900',
      'bg-indigo-900',
      'bg-yellow-900',
      'bg-teal-900',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      id={`show-${show.ShowID}`}
      className={`group cursor-pointer flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 transition-all duration-300 ${focused ? 'relative z-20' : 'relative z-0'}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        relative overflow-hidden rounded-lg transition-all duration-300
        ${focused ? 'scale-110 ring-4 ring-white shadow-2xl shadow-white/30' : isHovered ? 'scale-105 shadow-2xl shadow-black/50' : 'scale-100'}
      `}>
        <div className="aspect-video bg-gray-800 relative">
          {imageUrl ? (
            <>
              <ImageWithFallback
                src={imageUrl}
                alt={`${show.Artist} - ${show.VenueName}`}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            </>
          ) : (
            // Placeholder with artist initials
            <div className={`w-full h-full ${getColorFromString(show.Artist)} flex items-center justify-center`}>
              <div className="text-6xl text-white/40 font-bold">{artistInitials}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 right-3 flex gap-2">
            {show.ShowDate ? (
              <div className={`px-2 py-1 rounded text-xs transition-colors ${focused ? 'bg-white text-black' : 'bg-[#E50914]'}`}>
                {year}
              </div>
            ) : (
              <div className={`px-2 py-1 rounded text-xs transition-colors ${focused ? 'bg-gray-500 text-black' : 'bg-gray-700'}`}>
                Date Unknown
              </div>
            )}
            {show.RecordingType && (
              <div className="bg-black/70 px-2 py-1 rounded text-xs">
                {show.RecordingType}
              </div>
            )}
          </div>

          {/* Info overlay - always visible but enhanced on hover/focus */}
          <div className={`
            absolute bottom-0 left-0 right-0 p-4 transition-all duration-300
            ${focused || isHovered ? 'translate-y-0' : 'translate-y-0'}
          `}>
            <h3 className="text-sm mb-1 truncate">{show.Artist}</h3>
            <div className="flex items-center gap-3 text-xs text-gray-300 mb-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {location}
              </span>
            </div>
            
            {(focused || isHovered) && (
              <div className="space-y-1 text-xs text-gray-300 animate-in fade-in duration-200">
                {show.VenueName && <p className="truncate">{show.VenueName}</p>}
                {show.EventOrFestival && <p className="truncate text-[#E50914]">{show.EventOrFestival}</p>}
                <div className="flex items-center gap-3">
                  {durationMin > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {durationText}
                    </span>
                  )}
                  {show.Width && show.Height && (
                    <span className="text-gray-400">{show.Width}x{show.Height}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}