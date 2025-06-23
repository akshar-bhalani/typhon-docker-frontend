import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';
import { useGetBlogStatistics } from '@/api/dashboard';
import { BlogStatisticTimePeriods, TBlogStatisticTimePeriod } from '@/types/blogs';
import { Spinner } from '../ui/spinner';
import { AlertCircle } from 'lucide-react';

function BlogPostGraph() {
  const [data, setData] = useState([]);
  const [timeRange, setTimeRange] = useState<TBlogStatisticTimePeriod>('this_week');
  const { data: blogsData, isLoading, error } = useGetBlogStatistics(timeRange);

  useEffect(() => {
    if (blogsData) {
      setData(blogsData[timeRange]);
    }
  }, [timeRange, blogsData, setData]);

  const handleTimeRangeChange = (value: TBlogStatisticTimePeriod) => {
    setTimeRange(value);
  };

  return (
    <div className="my-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blogs Analytics</h2>
          <p className="text-muted-foreground">View blogs posted over time</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {BlogStatisticTimePeriods.map((period) => (
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
      ) : !data || data.length === 0 ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-lg text-muted-foreground">No data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400} className="-mx-6 overflow-hidden">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="blogs_posted"
              stroke="#8884d8"
              strokeWidth={2}
              name="Blogs Posted"
              dot={{ r: 3 }}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default BlogPostGraph;
