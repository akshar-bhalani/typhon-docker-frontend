import { useGetProfile } from '@/api/userManagement';
import { Button } from '@/components/ui/button';
import { queryKeys, useInvalidation } from '@/hooks/reactQuery';
import { useEffect } from 'react';
import { Link } from 'react-router';

const PaymentSuccess = () => {
  const { data: currentUser } = useGetProfile();
  const { handleInvalidate } = useInvalidation([
    queryKeys.userPlanDetails,
    queryKeys.userPaymentHistory,
    queryKeys.userSubscription,
  ]);

  useEffect(() => {
    handleInvalidate();
  }, []);

  return (
    <div className="mx-auto flex w-3/4 flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-4 text-3xl font-bold text-green-600">Payment Successful</h1>
      <p className="mb-8 text-center text-lg text-gray-700">
        Your payment was successful. checkout your plan details in your profile.
      </p>
      <Button className="rounded bg-blue-500 p-0 text-white hover:bg-blue-600">
        <Link to={`/users/${currentUser?.id}/subscription`} className="px-4 py-2">
          Go to Profile
        </Link>
      </Button>
    </div>
  );
};

export default PaymentSuccess;
