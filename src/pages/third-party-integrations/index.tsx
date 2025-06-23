import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';

export default function ThirdPartyIntegrationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Third-Party Integrations</h1>
      <Card>
        <CardHeader>
          <CardTitle>WordPress Integration</CardTitle>
          <CardDescription>Configure WordPress integration settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="wordpress-enabled" />
              <Label htmlFor="wordpress-enabled">Enable WordPress Integration</Label>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="wordpress-api-url">WordPress API URL</Label>
              <Input type="url" id="wordpress-api-url" placeholder="https://mywordpress.com/wp-json" />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Google Analytics Integration</CardTitle>
          <CardDescription>Configure Google Analytics integration settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="ga-enabled" />
              <Label htmlFor="ga-enabled">Enable Google Analytics Integration</Label>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="ga-tracking-id">Tracking ID</Label>
              <Input type="text" id="ga-tracking-id" placeholder="UA-XXXXXXXXX-X" />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
