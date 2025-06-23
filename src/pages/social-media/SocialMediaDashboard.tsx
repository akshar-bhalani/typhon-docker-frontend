import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { cn } from '@/lib/utils';

// Social media platforms configuration
const socialMediaPlatforms = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'View and manage LinkedIn posts and statistics',
    icon: FaLinkedin,
    class: 'bg-white p-0 text-blue-700',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'View and manage Facebook posts and statistics',
    icon: FaFacebook,
    class: 'bg-white p-0 text-blue-700',
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    description: 'View and manage Twitter posts and statistics',
    icon: FaXTwitter,
    class: 'bg-black',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'View and manage Instagram posts and statistics',
    icon: FaInstagram,
    class: 'bg-pink-600',
  },
];

const SocialMediaDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Social Media Management</h1>
      <p className="text-muted-foreground">
        View and manage social media posts and engagement across different platforms
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {socialMediaPlatforms.map((platform) => (
          <Link to={`/social-media/${platform.id}`} key={platform.id}>
            <Card className="h-full transition-colors hover:bg-gray-50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{platform.name}</CardTitle>
                  <platform.icon className={cn('size-7 rounded-lg p-0.5 text-white', platform.class)} />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{platform.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaDashboard;
