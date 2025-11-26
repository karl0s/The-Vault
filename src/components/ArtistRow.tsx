import { ShowCard } from './ShowCard';
import { Show } from '../App';

interface ArtistRowProps {
  artist: string;
  shows: Show[];
  onShowClick: (show: Show) => void;
  focusedShowId?: string;
  opacity?: number;
  isCenter?: boolean;
  getImageUrl?: (checksum: string, index: number) => string | null;
}

export function ArtistRow({ artist, shows, onShowClick, focusedShowId, opacity = 1, isCenter = false, getImageUrl }: ArtistRowProps) {
  const firstLetter = artist.charAt(0).toUpperCase();
  
  // Show more shows based on viewport width - responsive
  const displayShows = shows;

  return (
    <div 
      id={`artist-${artist.replace(/\s+/g, '-')}`} 
      data-artist={artist}
      className="mb-32 transition-opacity duration-200"
      style={{ opacity }}
    >
      <h2 className="text-xl lg:text-2xl mb-4 lg:mb-6 px-4 transition-opacity duration-200">{artist}</h2>
      <div className="relative">
        <div className="flex gap-2 md:gap-3 lg:gap-4 overflow-x-auto overflow-y-visible py-8 px-4 scrollbar-hide">
          {displayShows.map(show => (
            <ShowCard
              key={show.ShowID}
              show={show}
              onClick={() => onShowClick(show)}
              focused={show.ShowID === focusedShowId}
              getImageUrl={getImageUrl}
            />
          ))}
        </div>
        
        {/* Fade out indicator on right if more shows exist beyond viewport */}
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 lg:w-40 bg-gradient-to-l from-[#141414] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}