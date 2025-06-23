import { useGetUserPaymentHistory } from '@/api/userManagement';
import { IUserPaymentHistory } from '@/types/users';
import { useParams } from 'react-router';
import { DataTable } from '../DataTable';
import { format } from 'date-fns';
import { Spinner } from '../ui/spinner';

const columns = [
  {
    header: 'Amount',
    accessorKey: 'amount',
    cell: ({ row }) => {
      const currency = row.original.currency?.toUpperCase();
      const amount = row.original.amount;
      return `${currency} ${amount}`;
    },
  },
  {
    header: 'Date Time',
    accessorKey: 'payment_date',
    cell: ({ getValue }) => format(new Date(getValue()), 'PPpp'),
  },
  {
    header: 'Method',
    accessorKey: 'payment_method',
    cell: ({ getValue }) => getValue()?.charAt(0).toUpperCase() + getValue()?.slice(1),
  },
  {
    header: 'Status',
    accessorKey: 'payment_status',
    cell: ({ getValue }) => getValue()?.charAt(0).toUpperCase() + getValue()?.slice(1),
  },
];

export function UserPaymentHistory() {
  const params = useParams();
  const {
    data: paymentHistory,
    isLoading,
    isError: UserPaymentHistoryError,
    error,
  } = useGetUserPaymentHistory(params?.id || '');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Payment History</h2>

      {isLoading ? (
        <Spinner children={'Loading...'} className="text-[#8884d8]" />
      ) : UserPaymentHistoryError || !paymentHistory || !paymentHistory.length ? (
        <div>{error?.message || 'Something went wrong. Please contact admin support.'}</div>
      ) : (
        <DataTable columns={columns} data={paymentHistory as IUserPaymentHistory[]} isLoading={isLoading} />
      )}
    </div>
  );
}
