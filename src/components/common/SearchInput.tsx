import React from 'react';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  dataType: string;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

const SearchInput = ({ dataType, searchTerm, setSearchTerm, className }: SearchInputProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={`Search ${dataType}...`}
        value={searchTerm}
        onChange={handleSearchChange}
        className={cn('bg-white pl-10', className)}
      />
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
    </div>
  );
};

export default SearchInput;
