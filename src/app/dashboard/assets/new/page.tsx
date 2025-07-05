'use client';

import { AssetForm } from '@/components/assets/asset-form';
import { AssetCreationRequest } from '@/lib/validators/asset';

import { useRouter } from 'next/navigation';
import { useState } from 'react';


const NewAssetPage = () => {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: AssetCreationRequest) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to create asset');
      }

      console.log('Asset created successfully');
      router.push('/dashboard/assets');
      router.refresh(); // Refreshes the server components on the target page
    } catch (error) {
      console.error('Failed to create asset', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/assets');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Asset</h1>
        <p className="text-muted-foreground">Fill in the details below to add a new asset to your inventory.</p>
      </div>
      <AssetForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default NewAssetPage;
