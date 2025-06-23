import { UserParametersForm } from './UserParametersForm';
import { useAddUserParameters, useGetUserParameters } from '@/api/userManagement';
import { IUserParametersPayload } from '@/types';
import { toast } from '@/hooks/use-toast';
import { queryKeys, useInvalidation } from '@/hooks/reactQuery';
import { useParams } from 'react-router';

export function UserParameters() {
  const params = useParams();
  const { data: userParameters } = useGetUserParameters(params.id || '');
  const { mutate: addUserParams } = useAddUserParameters();
  const { handleInvalidate } = useInvalidation([queryKeys.userParameters]);

  const addParams = (data: IUserParametersPayload) => {
    return addUserParams(data, {
      onSuccess: () => {
        handleInvalidate();
        toast({
          title: 'User Parameters Added Successfully',
          description: 'User Parameters has been added.',
        });
      },
      onError: (error) => {
        toast({
          title: 'Failed to add User Parameters',
          description: error.message || 'An error occurred.',
        });
      },
    });
  };

  if (!params.id) {
    return;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Parameters</h2>
      <p className="text-muted-foreground">View and edit user-specific parameters</p>
      <UserParametersForm initialData={userParameters} user_id={params.id} onSubmit={addParams} />
    </div>
  );
}
