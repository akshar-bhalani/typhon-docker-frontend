import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

//TODO: Mock data - replace with actual data fetching logic
const mockActivityLog = [
  {
    id: '1',
    action: 'Login',
    details: 'User logged in',
    timestamp: '2023-06-01 10:00:00',
  },
  {
    id: '2',
    action: 'Blog Published',
    details: 'Published blog: "AI Trends 2023"',
    timestamp: '2023-06-02 14:30:00',
  },
  {
    id: '3',
    action: 'Settings Updated',
    details: 'Updated notification preferences',
    timestamp: '2023-06-03 09:15:00',
  },
];

export function UserActivityLog() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Activity Log</h2>
      <p className="text-muted-foreground">View user's recent activities</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockActivityLog.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>{activity.action}</TableCell>
              <TableCell>{activity.details}</TableCell>
              <TableCell>{activity.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
