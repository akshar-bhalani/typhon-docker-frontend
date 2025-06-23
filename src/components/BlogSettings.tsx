import { BlogSettingsTable } from './BlogSettingsTable';

export function BlogSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Blog Settings</h2>
      <p className="text-muted-foreground">Manage blog generation settings</p>
      <BlogSettingsTable />
    </div>
  );
}
