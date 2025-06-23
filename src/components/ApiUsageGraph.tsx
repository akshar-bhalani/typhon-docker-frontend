import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data - replace with actual data fetching logic
const mockApiUsage = [
  { date: '2023-06-01', count: 50 },
  { date: '2023-06-02', count: 75 },
  { date: '2023-06-03', count: 60 },
  { date: '2023-06-04', count: 90 },
  { date: '2023-06-05', count: 80 },
];

export function ApiUsageGraph() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">API Usage</h2>
      <p className="text-muted-foreground">View user's API usage over time</p>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockApiUsage}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
