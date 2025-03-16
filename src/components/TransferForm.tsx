
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Loader2, CheckCircle2, Music, ListMusic } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';

// Mock playlists
const MOCK_PLAYLISTS = {
  spotify: [
    { id: 'sp1', name: 'Chill Vibes', songCount: 24 },
    { id: 'sp2', name: 'Workout Mix', songCount: 15 },
    { id: 'sp3', name: 'Focus Flow', songCount: 32 },
  ],
  youtube: [
    { id: 'yt1', name: 'Summer Hits', songCount: 18 },
    { id: 'yt2', name: 'Road Trip', songCount: 26 },
    { id: 'yt3', name: 'Evening Jazz', songCount: 12 },
  ]
};

interface TransferFormProps {
  onSubmit: (data: any) => void;
  initialValues?: {
    sourcePlatform: 'spotify' | 'youtube';
    sourcePlaylistId: string;
    includeAll: boolean;
  };
}

const TransferForm: React.FC<TransferFormProps> = ({ onSubmit, initialValues }) => {
  const [direction, setDirection] = useState<'spotify-to-youtube' | 'youtube-to-spotify'>(
    initialValues?.sourcePlatform === 'youtube' ? 'youtube-to-spotify' : 'spotify-to-youtube'
  );
  const [sourcePlaylist, setSourcePlaylist] = useState(initialValues?.sourcePlaylistId || '');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [transferComplete, setTransferComplete] = useState(false);
  const [transferStats, setTransferStats] = useState({ total: 0, transferred: 0 });
  const { toast } = useToast();

  const handleDirectionChange = (value: 'spotify-to-youtube' | 'youtube-to-spotify') => {
    setDirection(value);
    setSourcePlaylist('');
  };

  const handleSourceChange = (value: string) => {
    setSourcePlaylist(value);
  };

  const handleNextStep = () => {
    if (step === 1 && !sourcePlaylist) {
      toast({
        title: "Error",
        description: "Please select a playlist to transfer",
        variant: "destructive"
      });
      return;
    }
    
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      startTransfer();
    }
  };

  const startTransfer = () => {
    setIsLoading(true);
    
    // Simulate transfer process
    const playlist = direction === 'spotify-to-youtube' 
      ? MOCK_PLAYLISTS.spotify.find(p => p.id === sourcePlaylist)
      : MOCK_PLAYLISTS.youtube.find(p => p.id === sourcePlaylist);
      
    const totalSongs = playlist?.songCount || 20;
    setTransferStats({ total: totalSongs, transferred: 0 });
    
    let transferred = 0;
    const interval = setInterval(() => {
      transferred += 1;
      setTransferStats({ total: totalSongs, transferred });
      
      if (transferred >= totalSongs) {
        clearInterval(interval);
        setIsLoading(false);
        setTransferComplete(true);
        toast({
          title: "Transfer Complete",
          description: `Successfully transferred ${totalSongs} songs`,
        });
        
        // Call the parent's onSubmit callback with transfer data
        onSubmit({
          sourcePlatform: direction === 'spotify-to-youtube' ? 'spotify' : 'youtube',
          targetPlatform: direction === 'spotify-to-youtube' ? 'youtube' : 'spotify',
          sourcePlaylistId: sourcePlaylist,
          includeAll: true,
          totalSongs
        });
      }
    }, 300);
  };

  const resetForm = () => {
    setDirection('spotify-to-youtube');
    setSourcePlaylist('');
    setStep(1);
    setIsLoading(false);
    setTransferComplete(false);
  };

  const sourcePlatform = direction === 'spotify-to-youtube' ? 'spotify' : 'youtube';
  const targetPlatform = direction === 'spotify-to-youtube' ? 'youtube' : 'spotify';
  const playlists = sourcePlatform === 'spotify' ? MOCK_PLAYLISTS.spotify : MOCK_PLAYLISTS.youtube;
  
  const sourcePlatformColor = sourcePlatform === 'spotify' ? 'text-spotify' : 'text-youtube';
  const targetPlatformColor = targetPlatform === 'spotify' ? 'text-spotify' : 'text-youtube';
  
  return (
    <div className="glass-card p-6 md:p-8 max-w-md w-full mx-auto">
      {!transferComplete ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Transfer Playlist</h2>
            <div className="flex items-center gap-1">
              <span className={cn("w-2.5 h-2.5 rounded-full", step >= 1 ? "bg-primary" : "bg-gray-200")}></span>
              <span className={cn("w-2.5 h-2.5 rounded-full", step >= 2 ? "bg-primary" : "bg-gray-200")}></span>
            </div>
          </div>
          
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <h3 className="font-medium">Choose direction</h3>
                <RadioGroup 
                  value={direction} 
                  onValueChange={(v) => handleDirectionChange(v as any)} 
                  className="grid grid-cols-1 gap-4"
                >
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="spotify-to-youtube" id="spotify-to-youtube" className="mt-1" />
                    <div className="flex-1">
                      <Label 
                        htmlFor="spotify-to-youtube" 
                        className="flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <span className="text-spotify">Spotify</span> 
                        <ArrowRight size={14} /> 
                        <span className="text-youtube">YouTube Music</span>
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">
                        Transfer your Spotify playlists to YouTube Music
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="youtube-to-spotify" id="youtube-to-spotify" className="mt-1" />
                    <div className="flex-1">
                      <Label 
                        htmlFor="youtube-to-spotify" 
                        className="flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <span className="text-youtube">YouTube Music</span> 
                        <ArrowRight size={14} /> 
                        <span className="text-spotify">Spotify</span>
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">
                        Transfer your YouTube Music playlists to Spotify
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">Select playlist to transfer</h3>
                <Select value={sourcePlaylist} onValueChange={handleSourceChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a playlist" />
                  </SelectTrigger>
                  <SelectContent>
                    {playlists.map((playlist) => (
                      <SelectItem key={playlist.id} value={playlist.id}>
                        {playlist.name} ({playlist.songCount} songs)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h3 className="font-medium">Confirm transfer details</h3>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Source</span>
                    <span className={cn("text-sm font-medium", sourcePlatformColor)}>
                      {sourcePlatform === 'spotify' ? 'Spotify' : 'YouTube Music'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Destination</span>
                    <span className={cn("text-sm font-medium", targetPlatformColor)}>
                      {targetPlatform === 'spotify' ? 'Spotify' : 'YouTube Music'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Playlist</span>
                    <span className="text-sm font-medium">
                      {playlists.find(p => p.id === sourcePlaylist)?.name}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Songs</span>
                    <span className="text-sm font-medium">
                      {playlists.find(p => p.id === sourcePlaylist)?.songCount}
                    </span>
                  </div>
                </div>
                
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-900/30 dark:bg-yellow-900/20 p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Transfer may take a few minutes depending on the size of the playlist. Don't close this page.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="mt-8 space-y-4 animate-fade-in">
              <div className="flex justify-between text-sm">
                <span>Transferring songs...</span>
                <span>
                  {transferStats.transferred}/{transferStats.total}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-primary"
                  style={{ width: `${(transferStats.transferred / transferStats.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-end">
            {step === 2 && !isLoading && (
              <Button 
                variant="outline" 
                onClick={() => setStep(1)} 
                className="mr-2"
              >
                Back
              </Button>
            )}
            
            <Button
              onClick={handleNextStep}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 px-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transferring...
                </>
              ) : step === 1 ? (
                <>Next</>
              ) : (
                <>Start Transfer</>
              )}
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-6 space-y-6 animate-fade-in">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Transfer Complete!</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Successfully transferred {transferStats.total} songs
            </p>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={resetForm}
            >
              Transfer Another Playlist
            </Button>
            
            <Button
              className="bg-primary hover:bg-primary/90"
            >
              View Playlist
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferForm;
