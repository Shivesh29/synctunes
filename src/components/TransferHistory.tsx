
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, ExternalLink, RefreshCw, Music } from 'lucide-react';
import { firestore } from '@/lib/firebase';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TransferRecord {
  id: string;
  sourcePlatform: 'spotify' | 'youtube';
  targetPlatform: 'spotify' | 'youtube';
  sourcePlaylistId: string;
  targetPlaylistId: string;
  songsTransferred: number;
  status: 'completed' | 'failed' | 'in-progress';
  createdAt: Date;
  completedAt?: Date;
}

const TransferHistory: React.FC = () => {
  const { toast } = useToast();
  const [history, setHistory] = useState<TransferRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchTransferHistory();
  }, []);
  
  const fetchTransferHistory = async () => {
    try {
      setIsLoading(true);
      const userId = 'user1'; // In a real app, get the authenticated user's ID
      const records = await firestore.getTransferHistory(userId);
      
      // Sort records by createdAt (newest first)
      const sortedRecords = records.sort((a, b) => {
        if (a.createdAt instanceof Date && b.createdAt instanceof Date) {
          return b.createdAt.getTime() - a.createdAt.getTime();
        }
        return 0;
      });
      
      setHistory(sortedRecords);
    } catch (error) {
      console.error('Error fetching transfer history:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load transfer history. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusColor = (status: 'completed' | 'failed' | 'in-progress') => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return '';
    }
  };
  
  const getPlatformColor = (platform: 'spotify' | 'youtube') => {
    return platform === 'spotify'
      ? 'bg-spotify/10 text-spotify'
      : 'bg-youtube/10 text-youtube';
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
          <CardDescription>Your recent playlist transfers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transfer History</CardTitle>
          <CardDescription>Your recent playlist transfers</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={fetchTransferHistory}
        >
          <RefreshCw size={14} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <Music className="mx-auto h-10 w-10 mb-4 opacity-50" />
            <p>No transfer history yet</p>
            <p className="text-sm mt-1">Start transferring playlists to see your history</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((record) => (
              <div 
                key={record.id} 
                className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={getPlatformColor(record.sourcePlatform)}
                    >
                      {record.sourcePlatform === 'spotify' ? 'Spotify' : 'YouTube'}
                    </Badge>
                    <span className="text-gray-400">→</span>
                    <Badge 
                      variant="outline" 
                      className={getPlatformColor(record.targetPlatform)}
                    >
                      {record.targetPlatform === 'spotify' ? 'Spotify' : 'YouTube'}
                    </Badge>
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className={cn("capitalize", getStatusColor(record.status))}
                  >
                    {record.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">
                      {record.songsTransferred} songs transferred
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {format(new Date(record.createdAt), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {format(new Date(record.createdAt), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    View <ExternalLink size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransferHistory;
