import { useState } from 'react';
import { UserSettingsForm } from '../../components/UserSettingsForm';

const initialSettings = {
  email_notifications: true,
  sms_notifications: false,
  push_notifications: true,
  newsletter_subscribed: true,
  blog_update_notifications: true,
  payment_notifications: true,
  system_alerts: true,
  notification_preference: 'email',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);

  const handleSettingsUpdate = (newSettings) => {
    setSettings(newSettings);
    // Here you would typically send the new settings to your backend
    console.log('Settings updated:', newSettings);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Settings</h1>
      <div className="max-w-2xl">
        <UserSettingsForm initialData={settings} onSubmit={handleSettingsUpdate} />
      </div>
    </div>
  );
}
