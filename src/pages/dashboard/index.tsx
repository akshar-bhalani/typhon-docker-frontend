import { useGetProfile } from '@/api/userManagement';
import AnalyticsData from '@/components/dashboard/AnalyticsData';
import BlogPostGraph from '@/components/dashboard/BlogPostGraph';
import SocialMediaAnalyticsGraph from '@/components/dashboard/SocialMediaAnalyticsGraph';

export default function Dashboard() {
  const { data: user } = useGetProfile();

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <AnalyticsData />
      {user?.role === 'User' && <BlogPostGraph />}
      {user?.role === 'User' && <hr />}
      {user?.role === 'User' && <SocialMediaAnalyticsGraph />}
    </div>
  );
}
