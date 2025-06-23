import { useState } from 'react';
import { useParams } from 'react-router';
import { DataTable } from './DataTable';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';
import { queryKeys, useInvalidation } from '@/hooks/reactQuery';
import { Download, Upload, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Input } from './ui/input';
import { useGetUserReviews, useDownloadSampleCSV, useUploadReviewsCSV } from '@/api/user-reviews';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function UserReviews() {
  const params = useParams();
  const { data: reviews, isPending, error } = useGetUserReviews(params.id || '');
  const { handleInvalidate } = useInvalidation([queryKeys.userReviews]);
  const { mutate: downloadSampleCSV, isPending: isDownloading } = useDownloadSampleCSV();
  const { mutate: uploadCSV, isPending: isUploading } = useUploadReviewsCSV();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDownloadSample = () => {
    downloadSampleCSV(undefined, {
      onSuccess: () => {
        toast({
          title: 'Download Successful',
          description: 'Sample CSV file has been downloaded.',
        });
      },
      onError: (error) => {
        toast({
          title: 'Download Failed',
          description: error.message || 'An error occurred while downloading the sample CSV.',
          variant: 'destructive',
        });
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: 'No File Selected',
        description: 'Please select a CSV file to upload.',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('user_id', params.id || '');

    uploadCSV(formData, {
      onSuccess: () => {
        handleInvalidate();
        setSelectedFile(null);
        toast({
          title: 'Upload Successful',
          description: 'Your reviews have been uploaded successfully.',
        });
      },
      onError: (error) => {
        toast({
          title: 'Upload Failed',
          description: error.message || 'An error occurred while uploading the file.',
          variant: 'destructive',
        });
      },
    });
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'number',
      header: 'Phone Number',
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => {
        const rating = row.getValue('rating');
        return '⭐'.repeat(Number(rating));
      },
    },
    {
      accessorKey: 'review',
      header: 'Review',
    },
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => {
        return formatDate(row.original.created_at || new Date());
      },
    },
  ];

  return (
    <div className="space-y-10 py-3">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Ratings & Reviews</h2>
            <p className="text-muted-foreground">Manage customer ratings and reviews</p>
          </div>
          <Button
            onClick={handleDownloadSample}
            disabled={isDownloading}
            variant="outline"
            className="flex cursor-pointer items-center justify-center gap-2 border-2"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? 'Downloading...' : 'Download Template CSV'}
          </Button>
        </div>

        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Upload Reviews</CardTitle>
            <CardDescription>Import customer reviews from a CSV file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center rounded-md border border-dashed border-gray-300 px-6 py-4">
              <label
                htmlFor="csvFile"
                className="flex cursor-pointer flex-col items-center justify-center gap-1 text-center"
              >
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div className="mt-2 font-medium">
                  {selectedFile ? selectedFile.name : 'Click to select a CSV file'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedFile ? `${(selectedFile.size / 1024).toFixed(2)} KB` : 'CSV files only'}
                </div>
                <Input id="csvFile" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            <Button
              onClick={handleUpload}
              disabled={isUploading || !selectedFile}
              className="flex w-full cursor-pointer items-center justify-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Upload CSV'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Customer Reviews List</h2>
          <p className="text-sm text-muted-foreground">All imported customer reviews and ratings</p>
        </div>
        <DataTable columns={columns} data={reviews || []} isLoading={isPending} errorMessage={error?.message} />
      </div>
    </div>
  );
}
