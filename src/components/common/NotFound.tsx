import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface NotFoundProps {
  title?: string;
  message?: string;
  buttonText?: string;
  redirectUrl?: string;
}

const NotFound = ({
  title = '404 - Page Not Found',
  message = 'Sorry, the page you are looking for does not exist.',
  buttonText = 'Go Back to Home',
  redirectUrl = '/',
}: NotFoundProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-sm">
      <AlertCircle className="h-16 w-16 text-red-500" />
      <h1 className="mt-6 text-3xl font-bold text-gray-900">{title}</h1>
      <p className="mt-4 max-w-md text-gray-600">{message}</p>
      <Button className="mt-6" onClick={() => navigate(redirectUrl)} size="lg">
        {buttonText}
      </Button>
    </div>
  );
};

export default NotFound;
