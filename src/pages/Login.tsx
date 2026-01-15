import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, UserPlus, Eye, EyeOff, Info } from 'lucide-react';
import type { UserCategory, ParticipationType } from '@/types/types';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userCategory, setUserCategory] = useState<UserCategory | ''>('');
  const [participationType, setParticipationType] = useState<ParticipationType | ''>('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInWithUsername, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as { from?: string })?.from || '/';

  // Load remembered username on component mount
  useEffect(() => {
    const rememberedUsername = localStorage.getItem('remembered_username');
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, []);

  // Check if user was redirected after account deletion
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('deleted') === 'true') {
      toast({
        title: 'Account Deleted',
        description: 'Your account has been deleted by an administrator. Please sign up again if you wish to continue.',
        variant: 'destructive',
        duration: 6000,
      });
      // Switch to signup mode
      setIsLogin(false);
      // Clean up URL
      window.history.replaceState({}, '', '/login');
    }
  }, [location.search, toast]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@iiitg\.ac\.in$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    return usernameRegex.test(username);
  };

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login validation
      if (!username || !password) {
        toast({
          title: 'Error',
          description: 'Please fill in all fields',
          variant: 'destructive',
        });
        return;
      }

      if (!validateUsername(username)) {
        toast({
          title: 'Invalid Username',
          description: 'Username can only contain letters, numbers, dots, hyphens, and underscores',
          variant: 'destructive',
        });
        return;
      }
    } else {
      // Signup validation
      if (!name || !email || !password || !userCategory) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields',
          variant: 'destructive',
        });
        return;
      }

      if (!validateName(name)) {
        toast({
          title: 'Invalid Name',
          description: 'Name must be at least 2 characters long',
          variant: 'destructive',
        });
        return;
      }

      if (!validateEmail(email)) {
        toast({
          title: 'Invalid Email',
          description: 'Please use your official IIIT Guwahati email ID (@iiitg.ac.in) to create an account.',
          variant: 'destructive',
        });
        return;
      }

      // Validate participation type for Faculty
      if (userCategory === 'Faculty' && !participationType) {
        toast({
          title: 'Error',
          description: 'Please select participation type for Faculty',
          variant: 'destructive',
        });
        return;
      }

      if (password.length < 6) {
        toast({
          title: 'Weak Password',
          description: 'Password must be at least 6 characters long',
          variant: 'destructive',
        });
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signInWithUsername(username, password, rememberMe);
        if (error) {
          toast({
            title: 'Login Failed',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Success',
            description: 'Logged in successfully',
          });
          navigate(from, { replace: true });
        }
      } else {
        const { error } = await signUpWithEmail(
          email, 
          password, 
          name, 
          userCategory as UserCategory, 
          participationType ? (participationType as ParticipationType) : undefined
        );
        if (error) {
          toast({
            title: 'Registration Failed',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Success',
            description: 'Account created successfully',
          });
          // Switch to login mode after successful signup
          setIsLogin(true);
          // Extract username from email for convenience
          const extractedUsername = email.split('@')[0];
          setUsername(extractedUsername);
          setName('');
          setEmail('');
          setPassword('');
          setUserCategory('');
          setParticipationType('');
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setName('');
    setEmail('');
    setUsername('');
    setPassword('');
    setUserCategory('');
    setParticipationType('');
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
              isLogin 
                ? 'bg-primary/10 text-primary' 
                : 'bg-secondary/20 text-secondary-foreground'
            }`}>
              {isLogin ? (
                <UserCircle className="h-8 w-8" />
              ) : (
                <UserPlus className="h-8 w-8" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl">{isLogin ? 'Welcome Back' : 'Create Account'}</CardTitle>
          <CardDescription>
            {isLogin
              ? 'Sign in to access your sports events'
              : 'Register with your IIIT Guwahati email'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field - Only shown during signup */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  autoComplete="name"
                />
                <p className="text-xs text-muted-foreground">
                  Your full name as you want it to appear
                </p>
              </div>
            )}

            {/* Email field - Only shown during signup */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="email">Institute Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.name@iiitg.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                />
                <p className="text-xs text-muted-foreground">
                  Must use your official IIIT Guwahati email (@iiitg.ac.in)
                </p>
              </div>
            )}

            {/* Category dropdown - Only shown during signup */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="category">
                  Select Your Year <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={userCategory}
                  onValueChange={(value) => {
                    setUserCategory(value as UserCategory);
                    // Reset participation type if category changes from Faculty
                    if (value !== 'Faculty') {
                      setParticipationType('');
                    }
                  }}
                  disabled={loading}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Choose your category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTech 1st Year">BTech 1st Year</SelectItem>
                    <SelectItem value="BTech 2nd Year">BTech 2nd Year</SelectItem>
                    <SelectItem value="BTech 3rd Year">BTech 3rd Year</SelectItem>
                    <SelectItem value="BTech 4th Year">BTech 4th Year</SelectItem>
                    <SelectItem value="MTech 1st Year">MTech 1st Year</SelectItem>
                    <SelectItem value="MTech 2nd Year">MTech 2nd Year</SelectItem>
                    <SelectItem value="PhD Scholar">PhD Scholar</SelectItem>
                    <SelectItem value="Faculty">Faculty</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Faculty Participation Type - Only shown when Faculty is selected */}
            {!isLogin && userCategory === 'Faculty' && (
              <div className="space-y-2 animate-fade-in-slide-down">
                <div className="flex items-center gap-2">
                  <Label htmlFor="participationType">
                    Participation Type <span className="text-destructive">*</span>
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[280px] p-3">
                        <div className="space-y-2 text-sm">
                          <p><strong>Friendly Mode:</strong> You will participate in exhibition matches only. Great for casual play without tournament pressure.</p>
                          <p><strong>Competitive Mode:</strong> You will be treated as a regular team and compete in the full tournament for prizes and glory.</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={participationType}
                  onValueChange={(value) => setParticipationType(value as ParticipationType)}
                  disabled={loading}
                >
                  <SelectTrigger id="participationType">
                    <SelectValue placeholder="Choose participation mode..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Friendly">Friendly - For exhibition matches only</SelectItem>
                    <SelectItem value="Competitive">Competitive - Full tournament participation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Username field - Only shown during login */}
            {isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="your.name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the part before @iiitg.ac.in from your email
                </p>
              </div>
            )}
            
            {/* Password field with show/hide toggle */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isLogin ? "Enter your password" : "Create a secure password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-muted-foreground">
                  Minimum 6 characters recommended
                </p>
              )}
            </div>

            {/* Remember Me checkbox - Only shown during login */}
            {isLogin && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={loading}
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me for faster login
                </Label>
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary hover:underline"
              disabled={loading}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
