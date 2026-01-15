import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

export default function ClearAuth() {
  const navigate = useNavigate();
  const [cleared, setCleared] = useState(false);
  const [loading, setLoading] = useState(false);

  const clearAllAuthData = async () => {
    setLoading(true);
    try {
      // 1. Sign out from Supabase
      await supabase.auth.signOut();

      // 2. Clear localStorage
      localStorage.clear();

      // 3. Clear sessionStorage
      sessionStorage.clear();

      // 4. Clear all cookies (if any)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      setCleared(true);
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Clear Authentication Data
          </CardTitle>
          <CardDescription>
            This will clear all login information and sign you out
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!cleared ? (
            <>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Warning</p>
                    <p className="text-sm text-muted-foreground">
                      This action will:
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>Sign you out from all sessions</li>
                      <li>Clear all stored credentials</li>
                      <li>Clear browser cache and cookies</li>
                      <li>Reset authentication state</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={clearAllAuthData}
                  disabled={loading}
                  variant="destructive"
                  className="w-full"
                >
                  {loading ? 'Clearing...' : 'Clear All Auth Data'}
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Success!</p>
                    <p className="text-sm text-muted-foreground">
                      All authentication data has been cleared.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Redirecting to home page...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
