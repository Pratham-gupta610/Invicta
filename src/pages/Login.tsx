import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/hooks/use-toast'
import { UserCircle, UserPlus, Eye, EyeOff, Info } from 'lucide-react'
import type { UserCategory, ParticipationType } from '@/types/types'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userCategory, setUserCategory] = useState<UserCategory | ''>('')
  const [participationType, setParticipationType] = useState<ParticipationType | ''>('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  const { signInWithUsername, signUpWithEmail, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  const from =
    (location.state as { from?: { pathname?: string } })?.from?.pathname || '/'

  // ✅ Redirect ONLY after auth state is ready
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user, from, navigate])

  // Remember username
  useEffect(() => {
    const rememberedUsername = localStorage.getItem('remembered_username')
    if (rememberedUsername) {
      setUsername(rememberedUsername)
      setRememberMe(true)
    }
  }, [])

  // Handle Supabase deleted=true redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('deleted') === 'true') {
      toast({
        title: 'Account Deleted',
        description:
          'Your account has been deleted. Please sign up again to continue.',
        variant: 'destructive',
      })
      setIsLogin(false)
      window.history.replaceState({}, '', '/login')
    }
  }, [location.search, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await signInWithUsername(username, password, rememberMe)

        if (error) {
          toast({
            title: 'Login Failed',
            description: error.message,
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Success',
            description: 'Logged in successfully',
          })
          // ❌ DO NOT navigate here
        }
      } else {
        const { error } = await signUpWithEmail(
          email,
          password,
          name,
          userCategory as UserCategory,
          participationType
            ? (participationType as ParticipationType)
            : undefined
        )

        if (error) {
          toast({
            title: 'Registration Failed',
            description: error.message,
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Success',
            description: 'Account created successfully. Please log in.',
          })
          setIsLogin(true)
          setUsername(email.split('@')[0])
          setName('')
          setEmail('')
          setPassword('')
          setUserCategory('')
          setParticipationType('')
        }
      }
    } catch {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              {isLogin ? <UserCircle /> : <UserPlus />}
            </div>
          </div>
          <CardTitle>{isLogin ? 'Welcome Back' : 'Create Account'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Sign in to continue' : 'Register with IIITG email'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isLogin && (
              <div>
                <Label>Username</Label>
                <Input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <Label>Password</Label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? 'Create an account' : 'Already have an account?'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
