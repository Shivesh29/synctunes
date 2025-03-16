import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PlaylistCard from '@/components/PlaylistCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ArrowRightLeft, Loader2, LogOut, Music, RefreshCw } from 'lucide-react';
import { SpotifyClient } from '@/lib/spotify';
import { YouTubeClient } from '@/lib/youtube';
import { firestore } from '@/lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const [spotifyPlaylists, setSpotifyPlaylists] = useState<any[]>([]);
  const [youtubePlaylists, setYoutubePlaylists] = useState<any[]>([]);
  const [isLoadingSpotify, setIsLoadingSpotify] = useState(true);
  const [isLoadingYoutube, setIsLoadingYoutube] = useState(true);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);
  
  useEffect(() => {
    fetchPlaylists();
  }, []);
  
  const fetchPlaylists = async () => {
    try {
      setIsLoadingSpotify(true);
      setIsLoadingYoutube(true);
      
      // Connect to Spotify if not already connected
      if (!SpotifyClient.isAuthenticated) {
        await SpotifyClient.connect();
      }
      
      // Connect to YouTube if not already connected
      if (!YouTubeClient.isAuthenticated) {
        await YouTubeClient.connect();
      }
      
      // Fetch Spotify playlists
      const spotifyData = await SpotifyClient.getUserPlaylists();
      setSpotifyPlaylists(spotifyData);
      
      // Fetch YouTube playlists
      const youtubeData = await YouTubeClient.getUserPlaylists();
      setYoutubePlaylists(youtubeData);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast({
        variant: "destructive",
        title: "Error fetching playlists",
        description: "Failed to load your playlists. Please try again."
      });
    } finally {
      setIsLoadingSpotify(false);
      setIsLoadingYoutube(false);
    }
  };
  
  const handleTransferClick = (playlist: any, platform: 'spotify' | 'youtube') => {
    setSelectedPlaylist({...playlist, platform});
    setIsTransferDialogOpen(true);
  };
  
  const handleTransferConfirm = () => {
    setIsTransferDialogOpen(false);
    
    toast({
      title: "Transfer initiated",
      description: `Starting transfer of "${selectedPlaylist.name || selectedPlaylist.title}" playlist.`
    });
    
    // Navigate to transfer page with the selected playlist ID
    navigate('/transfer', { 
      state: { 
        playlistId: selectedPlaylist.id,
        platform: selectedPlaylist.platform,
        playlistName: selectedPlaylist.name || selectedPlaylist.title
      } 
    });
  };
  
  const TransferConfirmation = () => {
    const targetPlatform = selectedPlaylist?.platform === 'spotify' ? 'YouTube Music' : 'Spotify';
    
    const Content = (
      <>
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
              {selectedPlaylist?.images?.[0]?.url || selectedPlaylist?.thumbnailUrl ? (
                <img 
                  src={selectedPlaylist?.images?.[0]?.url || selectedPlaylist?.thumbnailUrl} 
                  alt={selectedPlaylist?.name || selectedPlaylist?.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music size={24} className="text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium">{selectedPlaylist?.name || selectedPlaylist?.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedPlaylist?.tracks?.total || selectedPlaylist?.trackCount} tracks
              </p>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            This will transfer the playlist from {selectedPlaylist?.platform === 'spotify' ? 'Spotify' : 'YouTube Music'} to {targetPlatform}.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
            Cancel
          </Button>
          <Button className="gap-2 bg-primary" onClick={handleTransferConfirm}>
            <ArrowRightLeft size={16} />
            Confirm Transfer
          </Button>
        </div>
      </>
    );
    
    // Use Dialog on desktop and Drawer on mobile
    return isMobile ? (
      <Drawer open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Transfer Playlist</DrawerTitle>
            <DrawerDescription>
              You're about to transfer your playlist. This may take a few moments.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            {Content}
          </div>
          <DrawerFooter className="pt-2">
            {/* Footer content if needed */}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    ) : (
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Playlist</DialogTitle>
            <DialogDescription>
              You're about to transfer your playlist. This may take a few moments.
            </DialogDescription>
          </DialogHeader>
          {Content}
          <DialogFooter className="sm:justify-start">
            {/* Footer content if needed */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  const renderPlaylists = (playlists: any[], platform: 'spotify' | 'youtube') => {
    if (playlists.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No playlists found</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => platform === 'spotify' ? setIsLoadingSpotify(true) : setIsLoadingYoutube(true)}
          >
            Refresh
          </Button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            id={playlist.id}
            name={platform === 'spotify' ? playlist.name : playlist.title}
            songCount={platform === 'spotify' ? playlist.tracks.total : playlist.trackCount}
            platform={platform}
            imageUrl={platform === 'spotify' ? playlist.images[0]?.url : playlist.thumbnailUrl}
            onTransfer={() => handleTransferClick(playlist, platform)}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container px-6 py-8 mx-auto mt-16 mb-8 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="font-semibold tracking-tight">Your Playlists</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage and transfer your music playlists
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={fetchPlaylists}
              >
                <RefreshCw size={16} className={isLoadingSpotify || isLoadingYoutube ? "animate-spin" : ""} />
                Refresh
              </Button>
              
              <Link to="/transfer">
                <Button className="gap-2 bg-primary">
                  <ArrowRightLeft size={16} />
                  New Transfer
                </Button>
              </Link>
            </div>
          </div>
          
          <Tabs defaultValue="spotify" className="mt-8">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="spotify" className="text-base p-3">Spotify</TabsTrigger>
              <TabsTrigger value="youtube" className="text-base p-3">YouTube Music</TabsTrigger>
            </TabsList>
            
            <TabsContent value="spotify" className="mt-6">
              {isLoadingSpotify ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : (
                renderPlaylists(spotifyPlaylists, 'spotify')
              )}
            </TabsContent>
            
            <TabsContent value="youtube" className="mt-6">
              {isLoadingYoutube ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : (
                renderPlaylists(youtubePlaylists, 'youtube')
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <TransferConfirmation />
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
