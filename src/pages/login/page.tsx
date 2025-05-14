import { Link } from "react-router-dom";
import { API_BASE } from "../../App";
import LoginForm from "../../components/login-form";
import { Card, CardContent, CardDescription, CardHeader } from "../../components/ui/card";



export default function LoginPage() {

  return (

    <div className="flex flex-col mt-20 sm:mt-14 h-screen items-center">
      < Card className="sm: w-[400px]">
        <CardHeader className='pb-0'>
          <img src="/logo.webp" alt="Logo hai bencho" className="rounded-full w-[110px] h-[30px]" />
          {/* <CardTitle className='text-xl sm:text-3xl font-medium'>Admin Login </CardTitle> */}
          <CardDescription className='text-[15px] sm:text-lg font-medium mt-1 text-muted-foreground'>Login with your admin account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>

      <Link target="main" className="text-sm font-medium my-4 max-w-96 text-center" to={API_BASE + '/sign-up'} title='No account yet? Go to sign-up page'>
        No account yet? <span className="underline text-[15px] font-medium text-blue-500">Sign up {' '}</span> sign-up here with only credebtials
        and then asked admin to allow access.
      </Link>
    </div >
  )
}