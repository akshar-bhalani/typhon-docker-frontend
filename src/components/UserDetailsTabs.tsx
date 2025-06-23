import { Link, useNavigate } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { cn } from '../lib/utils';
import { User, Settings, Key, CreditCard, Sliders, ClipboardList } from 'lucide-react';
import { useGetProfile, useGetUserByID } from '@/api/userManagement';
import { useEffect } from 'react';

const UserTabItems = [
  { name: 'User Info', href: 'user-info', icon: User },
  { name: 'WordPress Keys', href: 'wordpress-keys', icon: Key },
  // { name: 'API Usage', href: 'api-usage', icon: BarChart },
  { name: 'Subscription', href: 'subscription', icon: CreditCard },
];

const AdminTabItems = [
  ...UserTabItems,
  { name: 'Blog Settings', href: 'blog-settings', icon: Settings },
  { name: 'User Parameters', href: 'user-parameters', icon: Sliders },
  { name: 'Blog Topics', href: 'blog-topics', icon: ClipboardList },
  // { name: 'Ratings & Reviews', href: 'reviews', icon: Star },
  // { name: 'Activity Log', href: 'activity-log', icon: Activity },
];

export function UserDetailsTabs() {
  const location = useLocation();
  const pathname = location.pathname;
  const params = useParams();
  const navigate = useNavigate();
  const { data: currentLoggedInUser } = useGetProfile();

  const { isLoading, isSuccess } = useGetUserByID(params.id);
  useEffect(() => {
    if (!isLoading && !isSuccess) {
      navigate('/not-found');
    }
  }, [isSuccess, isLoading]);

  if (!currentLoggedInUser) return;

  return (
    <Tabs defaultValue="user-info" className="w-full" value={params?.['*'] || 'user-info'}>
      <TabsList className="grid h-auto w-full grid-cols-3 lg:grid-cols-7">
        {(currentLoggedInUser?.role === 'User' ? UserTabItems : AdminTabItems).map((item) => {
          const href = `/users/${params.id}/${item.href}`;
          const isActive = pathname === href;
          return (
            <TabsTrigger
              key={item.name}
              value={item.href}
              className={cn(
                'flex h-20 flex-col items-center justify-center space-y-2 hover:bg-accent',
                isActive && 'bg-accent text-accent-foreground'
              )}
              asChild
            >
              <Link to={href}>
                <item.icon className="h-5 w-5" />
                <span className="text-center text-xs">{item.name}</span>
              </Link>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
