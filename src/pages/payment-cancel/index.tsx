import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

const PaymentCancel = () => {
  return (
    <div className="mx-auto flex w-3/4 flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-4 text-3xl font-bold text-red-600">Payment Cancelled</h1>
      <p className="mb-8 text-center text-lg text-gray-700">
        Your payment was cancelled. If you have any questions or need assistance, please contact our support team.
      </p>
      <Button className="rounded bg-blue-500 p-0 text-white hover:bg-blue-600">
        <Link to={`/subscriptions`} className="px-4 py-2">
          Go to Subscription Plans
        </Link>
      </Button>
    </div>
  );
};

export default PaymentCancel;
