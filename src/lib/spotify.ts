
// Mock Spotify service for SyncTunes
// This would be replaced with actual Spotify API implementation

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  tracks: {
    total: number;
    items: { track: SpotifyTrack }[];
  };
  images: { url: string }[];
}

// Mock playlists
const mockSpotifyPlaylists: SpotifyPlaylist[] = [
  {
    id: 'sp1',
    name: 'Chill Vibes',
    description: 'Relaxing tunes for your downtime',
    tracks: {
      total: 24,
      items: []
    },
    images: [{ url: 'https://picsum.photos/400/400?random=1' }]
  },
  {
    id: 'sp2',
    name: 'Workout Mix',
    description: 'High energy tracks to keep you moving',
    tracks: {
      total: 15,
      items: []
    },
    images: [{ url: 'https://picsum.photos/400/400?random=2' }]
  },
  {
    id: 'sp3',
    name: 'Focus Flow',
    description: 'Deep focus for productive work sessions',
    tracks: {
      total: 32,
      items: []
    },
    images: [{ url: 'https://picsum.photos/400/400?random=3' }]
  }
];

// Helper to delay async operations to simulate network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Spotify client
export const SpotifyClient = {
  isAuthenticated: false,
  
  // Connect to Spotify
  connect: async () => {
    await delay(1500);
    SpotifyClient.isAuthenticated = true;
    return true;
  },
  
  // Disconnect from Spotify
  disconnect: async () => {
    await delay(500);
    SpotifyClient.isAuthenticated = false;
    return true;
  },
  
  // Get user's playlists
  getUserPlaylists: async () => {
    await delay(1000);
    
    if (!SpotifyClient.isAuthenticated) {
      throw new Error('Not authenticated with Spotify');
    }
    
    return mockSpotifyPlaylists;
  },
  
  // Get a specific playlist
  getPlaylist: async (playlistId: string) => {
    await delay(800);
    
    if (!SpotifyClient.isAuthenticated) {
      throw new Error('Not authenticated with Spotify');
    }
    
    const playlist = mockSpotifyPlaylists.find(p => p.id === playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }
    
    return playlist;
  },
  
  // Create a new playlist
  createPlaylist: async (name: string, description: string = '') => {
    await delay(1500);
    
    if (!SpotifyClient.isAuthenticated) {
      throw new Error('Not authenticated with Spotify');
    }
    
    const newPlaylist: SpotifyPlaylist = {
      id: `sp${mockSpotifyPlaylists.length + 1}`,
      name,
      description,
      tracks: {
        total: 0,
        items: []
      },
      images: [{ url: `https://picsum.photos/400/400?random=${mockSpotifyPlaylists.length + 10}` }]
    };
    
    mockSpotifyPlaylists.push(newPlaylist);
    return newPlaylist;
  },
  
  // Add tracks to a playlist
  addTracksToPlaylist: async (playlistId: string, trackUris: string[]) => {
    await delay(trackUris.length * 100);
    
    if (!SpotifyClient.isAuthenticated) {
      throw new Error('Not authenticated with Spotify');
    }
    
    const playlist = mockSpotifyPlaylists.find(p => p.id === playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }
    
    playlist.tracks.total += trackUris.length;
    
    return {
      snapshot_id: Math.random().toString(36).substring(2, 15),
      tracks_added: trackUris.length
    };
  },
  
  // Search for tracks
  searchTracks: async (query: string, limit: number = 10) => {
    await delay(800);
    
    if (!SpotifyClient.isAuthenticated) {
      throw new Error('Not authenticated with Spotify');
    }
    
    // Mock search results
    return {
      tracks: {
        items: Array(limit).fill(null).map((_, i) => ({
          id: `track${i}`,
          name: `Track ${i} for "${query}"`,
          artists: [{ name: 'Artist Name' }],
          album: {
            name: 'Album Name',
            images: [{ url: `https://picsum.photos/400/400?random=${i}` }]
          },
          duration_ms: 180000 + Math.floor(Math.random() * 120000)
        }))
      }
    };
  }
};

export default SpotifyClient;
