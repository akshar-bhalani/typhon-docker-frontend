import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface SortFilterProps {
  order: 'asc' | 'desc';
  onChange: () => void;
  className?: string;
}

export const SortFilter: React.FC<SortFilterProps> = ({ order, onChange, className }) => {
  return (
    <div className={cn('flex cursor-pointer items-center gap-2 text-sm', className)} onClick={onChange}>
      <span>{order === 'asc' ? 'Oldest' : 'Newest'}</span>
      {order === 'asc' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
    </div>
  );
};
