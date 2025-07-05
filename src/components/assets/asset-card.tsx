'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// This local type should match the one in the main assets page
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

interface AssetCardProps {
  asset: Asset;
  onEdit: () => void;
  onDelete: () => void;
  onViewRecs: () => void;
}

export const AssetCard = ({ asset, onEdit, onDelete, onViewRecs }: AssetCardProps) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="truncate">{asset.name}</CardTitle>
        <CardDescription className="capitalize truncate">
          {asset.type.toLowerCase()} - {asset.brand} {asset.model}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {asset.description || 'No description provided.'}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 mt-4">
        <Button variant="ghost" size="sm" onClick={onViewRecs}>AI Recs</Button>
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
