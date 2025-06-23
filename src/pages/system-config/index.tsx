import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function SystemConfigPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Configuration</h1>
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure system-wide settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="site-name">Site Name</Label>
              <Input type="text" id="site-name" placeholder="My Admin Panel" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input type="email" id="admin-email" placeholder="admin@example.com" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="max-users">Max Users</Label>
              <Input type="number" id="max-users" placeholder="1000" />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
