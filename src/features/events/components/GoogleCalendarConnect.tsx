import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, CheckCircle2, Link2, LogOut } from 'lucide-react';
import { calendarApi } from '@/features/events/api/calendarApi';
import { Card, CardContent } from '@/components/ui/card';

interface GoogleCalendarConnectProps {
  onStatusChange?: (connected: boolean) => void;
}

export const GoogleCalendarConnect: React.FC<GoogleCalendarConnectProps> = ({ onStatusChange }) => {
  const [status, setStatus] = useState<{ connected: boolean; connected_at?: string }>({ connected: false });
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const data = await calendarApi.getGoogleConnectionStatus();
      setStatus(data);
      onStatusChange?.(data.connected);
    } catch (error) {
      console.error('Failed to fetch Google status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleConnect = async () => {
    try {
      const data = await calendarApi.getGoogleAuthUrl();
      if (data.code_verifier) {
          sessionStorage.setItem('google_code_verifier', data.code_verifier);
      }
      window.location.href = data.authorization_url;
    } catch (err) {
      console.error('Failed to get auth URL:', err);
      // In a real app, show a toast notification here
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Calendar?')) return;
    
    try {
        await calendarApi.disconnectGoogle();
        setStatus({ connected: false });
        onStatusChange?.(false);
    } catch (error) {
        console.error('Failed to disconnect:', error);
    }
  };

  if (loading) return <div className="animate-pulse h-20 bg-muted rounded-xl" />;

  if (status.connected) {
    return (
      <Card className="bg-emerald-500/10 border-emerald-500/20 mb-6">
        <CardContent className="flex flex-row items-center justify-between py-4">
            <div className="flex gap-4 items-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                <div>
                    <h4 className="text-emerald-500 font-bold text-sm">Google Calendar Connected</h4>
                    <p className="text-muted-foreground text-xs">
                        Your events are now synced with Google.
                    </p>
                </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDisconnect} className="gap-2 border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors">
                <LogOut className="h-4 w-4" />
                Disconnect
            </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
      <div className="flex gap-4 items-center">
          <div className="bg-primary/10 p-3 rounded-lg">
            <CalendarIcon className="h-8 w-8 text-primary" />
          </div>
          <div>
              <h3 className="text-lg font-bold">Sync with Google Calendar</h3>
              <p className="text-muted-foreground text-sm">Connect your Google account to manage meetings and sync events seamlessly.</p>
          </div>
      </div>
      <Button onClick={handleConnect} size="lg" className="px-8 gap-3 font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
          <Link2 className="h-5 w-5" />
          Connect Google Calendar
      </Button>
    </div>
  );
};
