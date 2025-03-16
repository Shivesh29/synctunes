
import React from 'react';
import { Music, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  className, 
  size = 'md',
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  const iconSizes = {
    sm: 18,
    md: 24,
    lg: 32
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <div className="absolute inset-0 animate-pulse-subtle">
          <Sparkles 
            size={iconSizes[size]} 
            className="text-spotify opacity-70" 
          />
        </div>
        <Music 
          size={iconSizes[size]} 
          className="relative z-10 text-primary animate-bounce-subtle" 
        />
      </div>
      
      {showText && (
        <span className={cn('font-semibold tracking-tight', sizeClasses[size])}>
          <span>Sync</span>
          <span className="text-spotify">Tunes</span>
        </span>
      )}
    </div>
  );
};

export default AnimatedLogo;
