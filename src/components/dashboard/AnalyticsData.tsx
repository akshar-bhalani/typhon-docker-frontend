import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, FileText, Globe } from 'lucide-react';
import { useGetProfile } from '@/api/userManagement';
import { Role } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetTotalBlogCount, useGetTotalUserCount } from '@/api/dashboard';
import { useGetSocialMediaCount } from '@/api/social-media';
import { platformDisplayNames, TSocialMediaPlatform } from '@/types/social-media';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { ReactNode } from 'react';

// Platform icons mapping
const platformIcons = {
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  x: FaXTwitter,
  instagram: FaInstagram,
};

const AnalyticsData = () => {
  const { data: currentUser } = useGetProfile();
  const { data: totalBlogs, isLoading: blogsLoading, error: blogsError } = useGetTotalBlogCount();
  const { data: totalUsers, isLoading: usersLoading, error: usersError } = useGetTotalUserCount(currentUser?.role);
  const { data: totalSocialMediaCount, isLoading: socialMediaLoading } = useGetSocialMediaCount();

  return (
    <div className="my-6 flex flex-col space-y-8">
      {/* User Analytics Section */}
      {(currentUser?.role === Role.SuperAdmin || currentUser?.role === Role.Admin) && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Users</h2>
          </div>
          {usersLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <AnalyticsCard
                title="Total Users"
                value={totalUsers?.total_users ?? 'N/A'}
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                isLoading={usersLoading}
                error={usersError}
                errorMessage="Error Loading Users Count"
              />
              <AnalyticsCard
                title="Active Users"
                value={totalUsers?.total_active_users ?? 'N/A'}
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                isLoading={usersLoading}
                error={usersError}
                errorMessage="Error Loading Active Users Count"
              />
            </div>
          )}
        </section>
      )}

      {/* Content Analytics Section */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Blogs</h2>
        </div>
        {blogsLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <AnalyticsCard
              title="Total Blogs"
              value={totalBlogs?.total_blogs ?? 'N/A'}
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
              isLoading={blogsLoading}
              error={blogsError}
              errorMessage="Error Loading Blogs Count"
            />
          </div>
        )}
      </section>

      {/* Social Media Analytics */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Social Media</h2>
        </div>

        {socialMediaLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : !totalSocialMediaCount?.platform_counts || totalSocialMediaCount.platform_counts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No social media data available</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {totalSocialMediaCount.platform_counts.map((item) => {
              const IconComponent = platformIcons[(item.platform || '') as TSocialMediaPlatform];
              const platformName = platformDisplayNames[(item.platform || '') as TSocialMediaPlatform] || item.platform;

              return (
                <AnalyticsCard
                  key={item.platform}
                  title={`${platformName} Posts`}
                  value={item.post_count || 0}
                  icon={IconComponent && <IconComponent className="h-4 w-4" />}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default AnalyticsData;

// Reusable Analytics Card component
interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  isLoading?: boolean;
  error?: unknown;
  errorMessage?: string;
}

const AnalyticsCard = ({
  title,
  value,
  icon,
  isLoading,
  error,
  errorMessage = 'Error Loading Data',
}: AnalyticsCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="mt-2 h-6 w-12" />
        ) : error ? (
          <div className="mt-2 text-xs text-red-500">{errorMessage}</div>
        ) : (
          <div className="mt-2 text-xl font-bold">{value ?? 'N/A'}</div>
        )}
      </CardContent>
    </Card>
  );
};
