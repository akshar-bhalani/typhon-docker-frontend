import { useParams } from 'react-router';
import { useState } from 'react';
import { UserForm } from './UserForm';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

import { useGetProfile, useGetUserByID } from '@/api/userManagement';
import { Button } from './ui/button';
import { capitalizeFirstLetter } from '@/lib/utils';

export function UserInfo() {
  const params = useParams();
  const { data: user, isLoading } = useGetUserByID(params.id);
  const { data: currentLoggedInUser } = useGetProfile();
  const [isEditMode, setIsEditMode] = useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit User Information' : 'User Information'}</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditMode ? (
            <UserForm
              disabledFields={
                currentLoggedInUser?.role === 'User'
                  ? ['email', 'role', 'assigned_admin', 'status']
                  : currentLoggedInUser?.role === 'Admin'
                    ? ['email', 'role', 'assigned_admin']
                    : ['email']
              }
              hiddenFields={currentLoggedInUser?.role === 'User' ? ['role', 'assigned_admin', 'status'] : []}
              initialData={user}
              setIsDialogOpen={setIsEditMode}
            />
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                {isLoading && <div>Loading...</div>}
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {currentLoggedInUser?.role !== 'User' && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Role</dt>
                      <dd className="text-sm">{user?.role}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Company</dt>
                    <dd className="text-sm">{user?.company_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                    <dd className="text-sm">{user?.phone}</dd>
                  </div>
                  {currentLoggedInUser?.role !== 'User' && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                      <dd className="text-sm">{capitalizeFirstLetter(user?.status)}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}
          <Button type="button" onClick={() => setIsEditMode(!isEditMode)} className="my-2">
            {isEditMode ? 'Cancel' : 'Edit'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
