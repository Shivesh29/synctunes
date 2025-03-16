
// Mock Firebase service for SyncTunes
// This would be replaced with actual Firebase implementation

interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

interface Playlist {
  id: string;
  name: string;
  platform: 'spotify' | 'youtube';
  userId: string;
  songs: Song[];
  createdAt: Date;
  imageUrl?: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  spotifyId?: string;
  youtubeId?: string;
}

interface TransferHistory {
  id: string;
  userId: string;
  sourcePlatform: 'spotify' | 'youtube';
  targetPlatform: 'spotify' | 'youtube';
  sourcePlaylistId: string;
  targetPlaylistId: string;
  songsTransferred: number;
  status: 'completed' | 'failed' | 'in-progress';
  createdAt: Date;
  completedAt?: Date;
}

// Mock user data
const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    photoURL: 'https://randomuser.me/api/portraits/men/32.jpg'
  }
];

// Mock playlists
const mockPlaylists: Playlist[] = [
  {
    id: 'sp1',
    name: 'Chill Vibes',
    platform: 'spotify',
    userId: 'user1',
    songs: [],
    createdAt: new Date(),
    imageUrl: 'https://picsum.photos/400/400?random=1'
  },
  {
    id: 'sp2',
    name: 'Workout Mix',
    platform: 'spotify',
    userId: 'user1',
    songs: [],
    createdAt: new Date(),
    imageUrl: 'https://picsum.photos/400/400?random=2'
  },
  {
    id: 'sp3',
    name: 'Focus Flow',
    platform: 'spotify',
    userId: 'user1',
    songs: [],
    createdAt: new Date(),
    imageUrl: 'https://picsum.photos/400/400?random=3'
  },
  {
    id: 'yt1',
    name: 'Summer Hits',
    platform: 'youtube',
    userId: 'user1',
    songs: [],
    createdAt: new Date(),
    imageUrl: 'https://picsum.photos/400/400?random=4'
  },
  {
    id: 'yt2',
    name: 'Road Trip',
    platform: 'youtube',
    userId: 'user1',
    songs: [],
    createdAt: new Date(),
    imageUrl: 'https://picsum.photos/400/400?random=5'
  },
  {
    id: 'yt3',
    name: 'Evening Jazz',
    platform: 'youtube',
    userId: 'user1',
    songs: [],
    createdAt: new Date(),
    imageUrl: 'https://picsum.photos/400/400?random=6'
  },
];

// Mock transfer history
const mockTransferHistory: TransferHistory[] = [
  {
    id: 'transfer1',
    userId: 'user1',
    sourcePlatform: 'spotify',
    targetPlatform: 'youtube',
    sourcePlaylistId: 'sp1',
    targetPlaylistId: 'yt4',
    songsTransferred: 24,
    status: 'completed',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 120000)
  },
  {
    id: 'transfer2',
    userId: 'user1',
    sourcePlatform: 'youtube',
    targetPlatform: 'spotify',
    sourcePlaylistId: 'yt1',
    targetPlaylistId: 'sp4',
    songsTransferred: 18,
    status: 'completed',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 90000)
  }
];

// Helper to delay async operations to simulate network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Firebase Authentication API
export const auth = {
  currentUser: null as User | null,

  // Sign in with email and password
  signInWithEmailAndPassword: async (email: string, password: string) => {
    await delay(1000);
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      auth.currentUser = user;
      return { user };
    }
    throw new Error('Invalid email or password');
  },

  // Sign up with email and password
  createUserWithEmailAndPassword: async (email: string, password: string, name: string) => {
    await delay(1000);
    const newUser: User = {
      id: `user${mockUsers.length + 1}`,
      name,
      email,
    };
    mockUsers.push(newUser);
    auth.currentUser = newUser;
    return { user: newUser };
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    await delay(1000);
    auth.currentUser = mockUsers[0];
    return { user: mockUsers[0] };
  },

  // Sign out
  signOut: async () => {
    await delay(500);
    auth.currentUser = null;
  }
};

// Mock Firestore API
export const firestore = {
  // Get user playlists
  getUserPlaylists: async (userId: string, platform?: 'spotify' | 'youtube') => {
    await delay(800);
    if (platform) {
      return mockPlaylists.filter(p => p.userId === userId && p.platform === platform);
    }
    return mockPlaylists.filter(p => p.userId === userId);
  },

  // Get playlist by ID
  getPlaylist: async (playlistId: string) => {
    await delay(600);
    return mockPlaylists.find(p => p.id === playlistId);
  },

  // Add playlist
  addPlaylist: async (playlist: Omit<Playlist, 'id'>) => {
    await delay(1000);
    const newPlaylist: Playlist = {
      ...playlist,
      id: `playlist${mockPlaylists.length + 1}`,
    };
    mockPlaylists.push(newPlaylist);
    return newPlaylist;
  },

  // Get transfer history
  getTransferHistory: async (userId: string) => {
    await delay(700);
    return mockTransferHistory.filter(t => t.userId === userId);
  },

  // Add transfer history
  addTransferHistory: async (transfer: Omit<TransferHistory, 'id'>) => {
    await delay(800);
    const newTransfer: TransferHistory = {
      ...transfer,
      id: `transfer${mockTransferHistory.length + 1}`,
    };
    mockTransferHistory.push(newTransfer);
    return newTransfer;
  }
};

export default {
  auth,
  firestore
};
