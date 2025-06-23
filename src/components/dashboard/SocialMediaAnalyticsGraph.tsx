import { useState, useMemo } from 'react';
import { useGetSocialMediaStatistics } from '@/api/social-media';
import {
  TSocialMediaPlatform,
  validPlatforms,
  platformDisplayNames,
  TSocialMediaStatisticsTimePeriod,
  SocialMediaStatisticsTimePeriods,
} from '@/types/social-media';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '../ui/spinner';

function SocialMediaAnalyticsGraph() {
  const [platform, setPlatform] = useState<TSocialMediaPlatform>('linkedin');
  const [period, setPeriod] = useState<TSocialMediaStatisticsTimePeriod>('this_week');

  const { data, isLoading, error } = useGetSocialMediaStatistics(platform, period);

  const chartData = useMemo(() => {
    if (!data) return [];
    return (
      data[period]?.map((item) => ({
        date: item.label,
        posts: item.posts_count,
      })) || []
    );
  }, [data, period]);

  const handlePlatformChange = (value: TSocialMediaPlatform) => {
    setPlatform(value);
  };

  const handlePeriodChange = (value: TSocialMediaStatisticsTimePeriod) => {
    setPeriod(value);
  };

  return (
    <div className="my-20">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Media Analytics</h2>
          <p className="text-muted-foreground">View social media posts activity over time</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
          <Select value={platform} onValueChange={handlePlatformChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {validPlatforms.map((p) => (
                <SelectItem key={p} value={p}>
                  {platformDisplayNames[p]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {SocialMediaStatisticsTimePeriods.map((period) => (
                <SelectItem key={period} value={period}>
                  {period.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner children={'Loading...'} className="text-[#8884d8]" />
        </div>
      ) : error ? (
        <div className="flex h-40 flex-col items-center justify-center text-gray-500">
          <AlertCircle className="mb-2 h-8 w-8" />
          <p>Failed to load data</p>
        </div>
      ) : !chartData || chartData.length === 0 ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-lg text-muted-foreground">No data available for this period</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400} className="-mx-6 overflow-hidden">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="posts"
              stroke="#8884d8"
              strokeWidth={2}
              name={`${platformDisplayNames[platform]} Posts Count`}
              dot={{ r: 3 }}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default SocialMediaAnalyticsGraph;
