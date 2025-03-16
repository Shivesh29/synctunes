
// Mock YouTube Music service for SyncTunes
// This would be replaced with actual YouTube API implementation

interface YouTubeTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  thumbnailUrl: string;
  duration: number;
}

interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  trackCount: number;
  tracks: YouTubeTrack[];
  thumbnailUrl: string;
}

// Mock playlists
const mockYouTubePlaylists: YouTubePlaylist[] = [
  {
    id: 'yt1',
    title: 'Summer Hits',
    description: 'The best summer songs',
    trackCount: 18,
    tracks: [],
    thumbnailUrl: 'https://picsum.photos/400/400?random=4'
  },
  {
    id: 'yt2',
    title: 'Road Trip',
    description: 'Perfect for long drives',
    trackCount: 26,
    tracks: [],
    thumbnailUrl: 'https://picsum.photos/400/400?random=5'
  },
  {
    id: 'yt3',
    title: 'Evening Jazz',
    description: 'Smooth jazz for evenings',
    trackCount: 12,
    tracks: [],
    thumbnailUrl: 'https://picsum.photos/400/400?random=6'
  }
];

// Helper to delay async operations to simulate network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock YouTube Music client
export const YouTubeClient = {
  isAuthenticated: false,
  
  // Connect to YouTube Music
  connect: async () => {
    await delay(1500);
    YouTubeClient.isAuthenticated = true;
    return true;
  },
  
  // Disconnect from YouTube Music
  disconnect: async () => {
    await delay(500);
    YouTubeClient.isAuthenticated = false;
    return true;
  },
  
  // Get user's playlists
  getUserPlaylists: async () => {
    await delay(1000);
    
    if (!YouTubeClient.isAuthenticated) {
      throw new Error('Not authenticated with YouTube Music');
    }
    
    return mockYouTubePlaylists;
  },
  
  // Get a specific playlist
  getPlaylist: async (playlistId: string) => {
    await delay(800);
    
    if (!YouTubeClient.isAuthenticated) {
      throw new Error('Not authenticated with YouTube Music');
    }
    
    const playlist = mockYouTubePlaylists.find(p => p.id === playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }
    
    return playlist;
  },
  
  // Create a new playlist
  createPlaylist: async (title: string, description: string = '') => {
    await delay(1500);
    
    if (!YouTubeClient.isAuthenticated) {
      throw new Error('Not authenticated with YouTube Music');
    }
    
    const newPlaylist: YouTubePlaylist = {
      id: `yt${mockYouTubePlaylists.length + 1}`,
      title,
      description,
      trackCount: 0,
      tracks: [],
      thumbnailUrl: `https://picsum.photos/400/400?random=${mockYouTubePlaylists.length + 10}`
    };
    
    mockYouTubePlaylists.push(newPlaylist);
    return newPlaylist;
  },
  
  // Add tracks to a playlist
  addTracksToPlaylist: async (playlistId: string, videoIds: string[]) => {
    await delay(videoIds.length * 100);
    
    if (!YouTubeClient.isAuthenticated) {
      throw new Error('Not authenticated with YouTube Music');
    }
    
    const playlist = mockYouTubePlaylists.find(p => p.id === playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }
    
    playlist.trackCount += videoIds.length;
    
    return {
      status: 'success',
      tracksAdded: videoIds.length
    };
  },
  
  // Search for tracks
  searchTracks: async (query: string, limit: number = 10) => {
    await delay(800);
    
    if (!YouTubeClient.isAuthenticated) {
      throw new Error('Not authenticated with YouTube Music');
    }
    
    // Mock search results
    return Array(limit).fill(null).map((_, i) => ({
      id: `video${i}`,
      title: `Video ${i} for "${query}"`,
      artist: 'Artist Name',
      album: 'Album Name',
      thumbnailUrl: `https://picsum.photos/400/400?random=${i}`,
      duration: 180 + Math.floor(Math.random() * 120)
    }));
  }
};

export default YouTubeClient;
