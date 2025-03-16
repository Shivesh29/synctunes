import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TransferForm from '@/components/TransferForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Check, Music, RefreshCw, X } from 'lucide-react';
import { SpotifyClient } from '@/lib/spotify';
import { YouTubeClient } from '@/lib/youtube';
import { firestore } from '@/lib/firebase';

interface TransferState {
  playlistId?: string;
  platform?: 'spotify' | 'youtube';
  playlistName?: string;
}

const Transfer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const state = location.state as TransferState || {};
  
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferComplete, setTransferComplete] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [totalTracks, setTotalTracks] = useState(0);
  const [matchedTracks, setMatchedTracks] = useState(0);
  const [sourcePlatform, setSourcePlatform] = useState<'spotify' | 'youtube'>(state.platform || 'spotify');
  const [targetPlatform, setTargetPlatform] = useState<'spotify' | 'youtube'>(state.platform === 'spotify' ? 'youtube' : 'spotify');
  const [sourcePlaylist, setSourcePlaylist] = useState<any>(null);
  const [targetPlaylist, setTargetPlaylist] = useState<any>(null);
  
  useEffect(() => {
    if (state.playlistId && state.platform) {
      fetchPlaylistDetails(state.playlistId, state.platform);
    }
  }, [state]);
  
  const fetchPlaylistDetails = async (playlistId: string, platform: 'spotify' | 'youtube') => {
    try {
      if (platform === 'spotify') {
        if (!SpotifyClient.isAuthenticated) {
          await SpotifyClient.connect();
        }
        const playlist = await SpotifyClient.getPlaylist(playlistId);
        setSourcePlaylist(playlist);
        setTotalTracks(playlist.tracks.total);
      } else {
        if (!YouTubeClient.isAuthenticated) {
          await YouTubeClient.connect();
        }
        const playlist = await YouTubeClient.getPlaylist(playlistId);
        setSourcePlaylist(playlist);
        setTotalTracks(playlist.trackCount);
      }
    } catch (error) {
      console.error('Error fetching playlist details:', error);
      toast({
        variant: "destructive",
        title: "Error fetching playlist",
        description: "Failed to load playlist details. Please try again."
      });
    }
  };
  
  const handleFormSubmit = async (data: any) => {
    const { sourcePlatform, sourcePlaylistId, includeAll } = data;
    
    setSourcePlatform(sourcePlatform);
    setTargetPlatform(sourcePlatform === 'spotify' ? 'youtube' : 'spotify');
    setIsTransferring(true);
    setProgress(0);
    setTransferComplete(false);
    setTransferError(null);
    
    try {
      await fetchPlaylistDetails(sourcePlaylistId, sourcePlatform);
      
      await simulateTransfer();
      
      setTransferComplete(true);
      toast({
        title: "Transfer complete",
        description: "Your playlist has been successfully transferred.",
      });
    } catch (error) {
      console.error('Transfer error:', error);
      setTransferError(error instanceof Error ? error.message : 'Failed to transfer playlist');
      toast({
        variant: "destructive",
        title: "Transfer failed",
        description: error instanceof Error ? error.message : 'Failed to transfer playlist',
      });
    } finally {
      setIsTransferring(false);
    }
  };
  
  const simulateTransfer = async () => {
    const playlistName = sourcePlaylist?.name || sourcePlaylist?.title || 'Transferred Playlist';
    const playlistDesc = `Transferred from ${sourcePlatform === 'spotify' ? 'Spotify' : 'YouTube Music'} using SyncTunes`;
    
    try {
      if (targetPlatform === 'spotify') {
        if (!SpotifyClient.isAuthenticated) {
          await SpotifyClient.connect();
        }
        const newPlaylist = await SpotifyClient.createPlaylist(playlistName, playlistDesc);
        setTargetPlaylist(newPlaylist);
      } else {
        if (!YouTubeClient.isAuthenticated) {
          await YouTubeClient.connect();
        }
        const newPlaylist = await YouTubeClient.createPlaylist(playlistName, playlistDesc);
        setTargetPlaylist(newPlaylist);
      }
      
      const total = totalTracks;
      const simulatedMatched = Math.floor(total * 0.85);
      setMatchedTracks(0);
      
      for (let i = 0; i < total; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(Math.round(((i + 1) / total) * 100));
        
        if (i < simulatedMatched) {
          setMatchedTracks(prev => prev + 1);
        }
      }
      
      const transferRecord = {
        userId: 'user1',
        sourcePlatform,
        targetPlatform,
        sourcePlaylistId: sourcePlaylist?.id,
        targetPlaylistId: targetPlaylist?.id,
        songsTransferred: matchedTracks,
        status: 'completed' as 'completed' | 'failed' | 'in-progress',
        createdAt: new Date(),
        completedAt: new Date()
      };
      
      await firestore.addTransferHistory(transferRecord);
      
    } catch (error) {
      console.error('Error in transfer:', error);
      throw new Error('Failed to complete the transfer process');
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container px-6 py-8 mx-auto mt-16 mb-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="font-semibold tracking-tight">Transfer Playlist</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Move your playlists between Spotify and YouTube Music
            </p>
          </div>
          
          {!isTransferring && !transferComplete && !transferError && (
            <Card className="p-6">
              <TransferForm 
                onSubmit={handleFormSubmit} 
                initialValues={{
                  sourcePlatform: state.platform || 'spotify',
                  sourcePlaylistId: state.playlistId || '',
                  includeAll: true
                }}
              />
            </Card>
          )}
          
          {isTransferring && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <RefreshCw size={48} className="mx-auto mb-4 text-primary animate-spin" />
                <h2 className="text-xl font-medium">Transferring Playlist</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Please wait while we transfer your tracks. This may take a few moments.
                </p>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2 text-sm">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Badge 
                    variant="outline" 
                    className={sourcePlatform === 'spotify' ? 'bg-spotify/10 text-spotify' : 'bg-youtube/10 text-youtube'}
                  >
                    {sourcePlatform === 'spotify' ? 'Spotify' : 'YouTube Music'}
                  </Badge>
                  <span className="mx-2">→</span>
                  <Badge 
                    variant="outline" 
                    className={targetPlatform === 'spotify' ? 'bg-spotify/10 text-spotify' : 'bg-youtube/10 text-youtube'}
                  >
                    {targetPlatform === 'spotify' ? 'Spotify' : 'YouTube Music'}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Matched: {matchedTracks}/{totalTracks} tracks
                </div>
              </div>
            </div>
          )}
          
          {transferComplete && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900">
                <Check size={32} className="text-green-600 dark:text-green-400" />
              </div>
              
              <h2 className="text-2xl font-medium mb-4">Transfer Complete!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Successfully transferred {matchedTracks} tracks from {sourcePlatform === 'spotify' ? 'Spotify' : 'YouTube Music'} to {targetPlatform === 'spotify' ? 'Spotify' : 'YouTube Music'}.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => {
                    setTransferComplete(false);
                    setSourcePlaylist(null);
                    setTargetPlaylist(null);
                  }}
                >
                  Start New Transfer
                </Button>
                
                <Button 
                  className="gap-2 bg-primary"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}
          
          {transferError && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900">
                <X size={32} className="text-red-600 dark:text-red-400" />
              </div>
              
              <h2 className="text-2xl font-medium mb-4">Transfer Failed</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {transferError}
              </p>
              
              <Button 
                className="gap-2 bg-primary"
                onClick={() => {
                  setTransferError(null);
                  setSourcePlaylist(null);
                  setTargetPlaylist(null);
                }}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Transfer;
