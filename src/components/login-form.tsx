import { useFormStatus } from 'react-dom'
import { useEffect, useState } from 'react'
import { Eye, EyeOff, Loader } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { API_BASE } from '../App'
import { useAuth } from '../hooks/useAuth'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Input } from './ui/input'


export default function LoginForm() {
  const [searchParams] = useSearchParams();
  const { user, setShouldFetch } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const redirectUrl = searchParams.get("redirect_url") || "/";
  const router = useNavigate();
  const [result, setResult] = useState<Result | null>({ type: '', resultCode: "", token: '' });

  async function authenticate(
    formData: FormData) {
    const email = formData.get('email')
    const password = formData.get('password');
    const parsedCredentials = z
      .object({
        email: z.string().email(),
        password: z.string().min(6, 'Password must contian 6 characters')
      })
      .safeParse({
        email,
        password
      })

    if (parsedCredentials.error) {
      parsedCredentials.error.issues.map((i, _) => (
        toast.error(i.message)
      ))
    } else {
      try {
        const response = await fetch(API_BASE + '/api/admin/auth/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: parsedCredentials.data.email, password: parsedCredentials.data.password }),
        });

        const result = await response.json();
        setResult(result)
      } catch (error) {
        console.error('Error in authentication:', error);
        toast.error('Error in authentication: ' + (error as Error).message);
      }
    }
  }


  useEffect(() => {
    async function updateSession() {
      if (result && result.type) {
        if (result.type === 'error') {
          toast.error(result.resultCode)
        } else {
          toast.success(result.resultCode)
          setShouldFetch();
        }
      }
    }
    updateSession();
  }, [result]);

  useEffect(() => {
    if (user) {
      router(redirectUrl)
    }
  }, [user]);
  return (
    <form
      action={(formData) => authenticate(formData)}
    >
      <Label
        className="mb-3 block text-small-medium text-zinc-400"
        htmlFor="email"
      >
        Email
      </Label>
      <div className="relative">
        <Input
          className="peer font-medium block w-full valid:border-green-500 rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email address"
          required
        />
      </div>

      <div className="mb-6 relative">
        <div className="mt-3 mb-1 flex justify-between items-center">
          <Label
            className="block text-small-medium text-zinc-400"
            htmlFor="password"
          >
            Password
          </Label>
          <Button
            type="button"
            variant={'ghost'}
            size={'icon'}
            title={showPassword ? 'Hide Password' : 'Show Password'}
            onClick={() => setShowPassword(prev => !prev)}
            className="msb-3 block text-small-medium text-zinc-400"
          >
            {showPassword ? <Eye size={'1rem'} /> : <EyeOff size={'1rem'} />}
          </Button>
        </div>

        <Input
          className="peer font-medium invalid:border-red-500 block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
          id="password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Enter password"
          minLength={6}
          title="Must be at least 6 characters and better to have include upper & lower case letters and a symbol (#, $, &)"
        // required
        />

        <div className="absolute z-10 hidden peer-invalid:block text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-xs w-72 mt-2 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
          <div className="p-3 space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Must have at least 6 characters
            </h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="h-1 bg-orange-300 dark:bg-orange-400"></div>
              <div className="h-1 bg-orange-300 dark:bg-orange-400"></div>
              <div className="h-1 bg-gray-200 dark:bg-gray-600"></div>
              <div className="h-1 bg-gray-200 dark:bg-gray-600"></div>
            </div>
            <p>It's better to have:</p>
            <ul>
              <li className="flex items-center mb-1">
                Upper & lower case letters
              </li>
              <li className="flex items-center mb-1">A symbol (#$&)</li>
              <li className="flex items-center">
                A longer password (min. 12 chars.)
              </li>
            </ul>
          </div>
        </div>
      </div>
      <LoginButton />
    </form>
  )
}

function LoginButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      title='Click here to Login'
      className='w-full font-medium'
      disabled={pending}
    >
      {pending ? <Loader className='animate-spin' /> : 'Log in'}
    </Button>
  )
}
