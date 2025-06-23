import { Link } from 'react-router';
import { LoginForm } from '../../components/LoginForm';
import { ResetPasswordForm } from '@/components/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Reset You Password</h1>
        <p className="text-sm text-muted-foreground">Reset your password to login to your account</p>
      </div>
      <ResetPasswordForm />

      <p className="px-8 text-center text-sm text-muted-foreground">
        <div className="mb-2">
          <Link to="/" className="underline underline-offset-4 hover:text-primary">
            LogIn
          </Link>
        </div>
        By clicking continue, you agree to our{' '}
        <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
}
