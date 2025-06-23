import { Suspense } from 'react';
import { UserDetailsTabs } from '../../../components/UserDetailsTabs';
import { Card, CardContent } from '../../../components/ui/card';
import { Routes, Route } from 'react-router';
import { UserInfo } from '@/components/UserInfo';
import { BlogSettings } from '@/components/BlogSettings';
import { WordPressKeys } from '@/components/WordPressKeys';
// import { UserActivityLog } from '@/components/UserActivityLog';
// import { ApiUsageGraph } from '@/components/ApiUsageGraph';
import { UserParameters } from '@/components/UserParameters';
import UserPlanDetails from '@/components/subscriptions/UserPlanDetails';
import NotFound from '@/components/common/NotFound';
import Unauthorized from '@/components/common/Unauthorized';
import { Users } from '@/types';
import { BlogTopics } from '@/components/BlogTopics';
// import { UserReviews } from '@/components/UserReviews';

export default function UserDetails({ currentLoggedInUser }: { currentLoggedInUser: Users }) {
  return (
    <div className="container mx-auto space-y-6 py-6">
      <h1 className="text-3xl font-bold">User Details</h1>
      <Card>
        <CardContent className="p-6">
          <Suspense fallback={<div>Loading...</div>}>
            <UserDetailsTabs />
          </Suspense>
          <div className="py-6">
            <Routes>
              <Route index element={<UserInfo />} />
              <Route path="user-info" element={<UserInfo />} />
              <Route
                path="blog-settings"
                element={currentLoggedInUser?.role !== 'User' ? <BlogSettings /> : <Unauthorized />}
              />
              <Route path="wordpress-keys" element={<WordPressKeys />} />
              {/* <Route
                path="activity-log"
                element={currentLoggedInUser?.role !== 'User' ? <UserActivityLog /> : <Unauthorized />}
              /> */}
              <Route path="subscription" element={<UserPlanDetails />} />
              {/* <Route path='api-usage' element={<ApiUsageGraph />} /> */}
              <Route
                path="user-parameters"
                element={currentLoggedInUser?.role !== 'User' ? <UserParameters /> : <Unauthorized />}
              />
              <Route
                path="blog-topics"
                element={currentLoggedInUser?.role !== 'User' ? <BlogTopics /> : <Unauthorized />}
              />
              {/* <Route path="reviews" element={<UserReviews />} /> */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
