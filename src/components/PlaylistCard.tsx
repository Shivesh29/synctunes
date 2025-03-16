
import React from 'react';
import { Button } from '@/components/ui/button';
import { Music, ExternalLink, ArrowRightLeft, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PlaylistCardProps {
  id: string;
  name: string;
  songCount: number;
  platform: 'spotify' | 'youtube';
  imageUrl?: string;
  onTransfer?: (id: string) => void;
  className?: string;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  id,
  name,
  songCount,
  platform,
  imageUrl,
  onTransfer,
  className
}) => {
  const platformColor = platform === 'spotify' ? 'text-spotify' : 'text-youtube';
  const platformBg = platform === 'spotify' ? 'bg-spotify/10' : 'bg-youtube/10';
  const platformText = platform === 'spotify' ? 'Spotify' : 'YouTube Music';
  
  return (
    <div 
      className={cn(
        "glass-card overflow-hidden group transition-all duration-300 hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Music size={48} className="text-gray-400" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <div className="flex justify-between items-center">
              <Badge 
                variant="outline" 
                className={cn("text-xs font-medium", platformColor, platformBg)}
              >
                {platformText}
              </Badge>
              
              <a 
                href="#" 
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="View details"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-base line-clamp-1">{name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {songCount} {songCount === 1 ? 'song' : 'songs'}
            </p>
          </div>
          
          <button className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
        
        {onTransfer && (
          <Button 
            onClick={() => onTransfer(id)} 
            variant="outline" 
            className="w-full mt-4 gap-2"
          >
            <ArrowRightLeft size={14} />
            Transfer
          </Button>
        )}
      </div>
    </div>
  );
};

export default PlaylistCard;
