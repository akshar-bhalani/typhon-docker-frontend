import { useParams } from 'react-router';
import { UserPaymentHistory } from './UserPaymentHistory';
import { useGetUserPlanDetails } from '@/api/userManagement';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatDate } from '@/lib/utils';
import { Spinner } from '../ui/spinner';

const UserPlanDetails = () => {
  const params = useParams();
  const {
    data: userPlanDetails,
    isLoading,
    isError: userPlanDetailsError,
    error,
  } = useGetUserPlanDetails(params?.id || '');
  const userPlan = userPlanDetails?.plan;

  return (
    <div className="flex flex-col items-start justify-between gap-4 lg:flex-row">
      <Card className="min-h-[320px] w-1/2 min-w-36 rounded-lg border border-gray-200 shadow-md">
        <CardHeader className="bg-gray-100 p-4">
          <CardTitle className="text-nowrap text-2xl font-bold text-gray-800">Current Plan</CardTitle>
        </CardHeader>
        {isLoading ? (
          <CardContent className="mt-6 p-4">
            <Spinner children={'Loading...'} className="text-[#8884d8]" />
          </CardContent>
        ) : userPlanDetailsError || !userPlan ? (
          <CardContent className="mt-6 p-4">
            {error?.message || 'Something went wrong. Please contact admin support.'}
          </CardContent>
        ) : (
          <CardContent className="p-4">
            <h2 className="mb-4 text-xl font-bold text-gray-800">{userPlan.name}</h2>
            <p className="mb-4 text-gray-600">{userPlan.description}</p>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-800">
                {userPlan.currency.toUpperCase()} {userPlan.price_per_month} /month
              </p>
              <ul className="mb-4 list-inside list-disc text-gray-600">
                <li>Max Blogs per Month: {userPlan.max_blogs_per_month}</li>
                <li>Max Refresh Count: {userPlan.max_refresh_count}</li>
                <li>Frequency: {userPlan.frequency}</li>
              </ul>
              <p className="text-gray-600">
                <span className="font-semibold">Start Date:</span> {formatDate(new Date(userPlanDetails.start_date))}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">End Date:</span> {formatDate(new Date(userPlanDetails.end_date))}
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="mb-4 w-full rounded border border-gray-200 p-4">
        <UserPaymentHistory />
      </div>
    </div>
  );
};

export default UserPlanDetails;
