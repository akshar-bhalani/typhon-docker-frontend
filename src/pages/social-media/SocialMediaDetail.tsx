import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PaginationSettings } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';
import NotFound from '@/components/common/NotFound';
import SocialMediaTable from './SocialMediaTable';
import { TSocialMediaPlatform, validPlatforms } from '@/types/social-media';
import { useGetSocialMediaData } from '@/api/social-media';
import { ChevronLeft } from 'lucide-react';
import { DateRange } from 'react-day-picker';

const SocialMediaDetail = () => {
  const { platform } = useParams<{ platform: string }>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>();

  const [pagination, setPagination] = useState<PaginationSettings>({
    page: 1,
    order: 'desc',
    limit: 5,
    total: 0,
  });

  // Redirect to Not Found if invalid platform
  if (!platform || !validPlatforms.includes(platform.toLowerCase() as TSocialMediaPlatform)) {
    return (
      <NotFound
        title="Invalid Social Media Platform"
        message={`"${platform}" is not a supported social media platform.`}
        buttonText="Return to Social Media Dashboard"
        redirectUrl="/social-media"
      />
    );
  }

  const { data, isLoading, error } = useGetSocialMediaData(
    platform as TSocialMediaPlatform,
    pagination,
    debouncedSearchTerm,
    selectedDateRange?.from,
    selectedDateRange?.to
  );

  // Update total pages when data is received
  useEffect(() => {
    if (data) {
      setPagination((prev) => {
        const totalPages = Math.ceil(data.count / prev.limit);

        return {
          ...prev,
          page: Math.min(prev.page, totalPages) || 1,
          total: totalPages,
        };
      });
    }
  }, [data]);

  const handleDateChange = (dateRange: DateRange | undefined) => {
    setSelectedDateRange(dateRange);
  };

  return (
    <div className="space-y-4">
      <Link
        to="/social-media"
        className="inline-flex items-center text-xs text-gray-500 hover:font-medium hover:text-gray-800"
      >
        <ChevronLeft className="mr-1 h-3 w-3" />
        Back to Social Media Dashboard
      </Link>

      <SocialMediaTable
        platform={platform as TSocialMediaPlatform}
        data={data?.results || []}
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        setPagination={setPagination}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDateRange={selectedDateRange}
        handleDateChange={handleDateChange}
      />
    </div>
  );
};

export default SocialMediaDetail;
