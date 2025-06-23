import { useGetProfile } from '@/api/userManagement';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { CardTitle } from './ui/card';

const Header = () => {
  const { data: user } = useGetProfile();
  return (
    <header className="flex bg-white px-2 py-2 tracking-wide shadow-md sm:px-10">
      <div className="flex w-full flex-wrap items-center justify-end">
        <div className="flex items-center space-x-2">
          <Avatar className="h-[50px] w-[50px] capitalize">
            <AvatarImage src={user?.avatarUrl} alt={user?.name} />
            <AvatarFallback>
              {user?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-large capitalize">{user?.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{user?.company_name}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
