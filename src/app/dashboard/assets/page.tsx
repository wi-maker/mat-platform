'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AssetCard } from '@/components/assets/asset-card';
import { AssetForm } from '@/components/assets/asset-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PlusCircle, Inbox, Loader2, Wand2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { getMaintenanceRecommendations, MaintenanceRecommendation } from '@/lib/ai';
import { RecommendationCard } from '@/components/recommendations/recommendation-card';

// Mock data structure and types
const assetTypes = ['CAR', 'GENERATOR', 'APPLIANCE', 'OTHER'] as const;
type AssetType = typeof assetTypes[number];

interface Asset {
  id: string;
  name: string;
  type: AssetType;
  brand?: string;
  model?: string;
  description?: string;
}

const mockAssets: Asset[] = [
  {
    id: uuidv4(),
    name: 'Perkins Generator',
    type: 'GENERATOR',
    brand: 'Perkins',
    model: '1104A-44TG2',
    description: 'Main backup generator for the facility.',
  },
  {
    id: uuidv4(),
    name: 'Toyota Hilux',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Hilux',
    description: 'Company utility vehicle.',
  },
];

const AssetsPage = () => {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [filter, setFilter] = useState<AssetType | 'ALL'>('ALL');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isRecsModalOpen, setIsRecsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [recommendations, setRecommendations] = useState<MaintenanceRecommendation[]>([]);
  const [isRecsLoading, setIsRecsLoading] = useState(false);

  useEffect(() => {
    if (filter === 'ALL') {
      setFilteredAssets(assets);
    } else {
      setFilteredAssets(assets.filter((asset) => asset.type === filter));
    }
  }, [assets, filter]);

  const handleAddClick = () => {
    setSelectedAsset(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDeleteAlertOpen(true);
  };

  const handleViewRecsClick = async (asset: Asset) => {
    setSelectedAsset(asset);
    setIsRecsModalOpen(true);
    setIsRecsLoading(true);
    try {
      const data = await getMaintenanceRecommendations(asset);
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to fetch recommendations', error);
      setRecommendations([]);
    } finally {
      setIsRecsLoading(false);
    }
  };

  const handleSaveAsset = (data: Omit<Asset, 'id'>) => {
    if (selectedAsset) {
      // Update existing asset
      setAssets(assets.map(a => a.id === selectedAsset.id ? { ...a, ...data } : a));
    } else {
      // Add new asset
      setAssets([...assets, { ...data, id: uuidv4() }]);
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedAsset) return;
    setAssets(assets.filter(a => a.id !== selectedAsset.id));
    setIsDeleteAlertOpen(false);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Assets</h1>
          <p className="text-muted-foreground">View and manage your registered assets.</p>
        </div>
        <Button onClick={handleAddClick}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant={filter === 'ALL' ? 'default' : 'outline'} onClick={() => setFilter('ALL')}>All</Button>
        {assetTypes.map((type) => (
          <Button key={type} variant={filter === type ? 'default' : 'outline'} onClick={() => setFilter(type)} className="capitalize">
            {type.toLowerCase()}
          </Button>
        ))}
      </div>

      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} onEdit={() => handleEditClick(asset)} onDelete={() => handleDeleteClick(asset)} onViewRecs={() => handleViewRecsClick(asset)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Inbox className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No assets found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new asset.</p>
        </div>
      )}

      {/* Add/Edit Asset Modal */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedAsset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
          </DialogHeader>
          <AssetForm
            initialData={selectedAsset}
            onSave={handleSaveAsset}
            onClose={() => setIsFormModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* AI Recommendations Modal */}
      <Dialog open={isRecsModalOpen} onOpenChange={setIsRecsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Recommendations for {selectedAsset?.name}</DialogTitle>
          </DialogHeader>
          {isRecsLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
              {recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <RecommendationCard key={rec.id} recommendation={rec} />
                ))
              ) : (
                <p className="text-center text-muted-foreground">No recommendations available.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Asset Confirmation */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the asset
              <strong> {selectedAsset?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AssetsPage;
