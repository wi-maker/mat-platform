'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { RecommendationCard } from '@/components/recommendations/recommendation-card';
import { generateRecommendations, MaintenanceRecommendation } from '@/lib/ai';

type RecommendationPriority = MaintenanceRecommendation['priority'];
import { Loader2, Wand2, Car, Zap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock user assets
const mockAssets = [
  { id: 'asset-1', name: 'Toyota Hilux', type: 'CAR', brand: 'Toyota', model: 'Hilux', purchaseDate: '2020-01-15' },
  { id: 'asset-2', name: 'Perkins Generator', type: 'GENERATOR', brand: 'Perkins', model: '1104A-44TG1' },
];

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState<MaintenanceRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<RecommendationPriority | 'ALL'>('ALL');

  const handleGenerate = async (asset: typeof mockAssets[0]) => {
    setIsGenerating(asset.id);
    try {
      const newRecs = await generateRecommendations(asset);
      // Replace existing recommendations for this asset and add new ones
      setRecommendations(prev => [
        ...prev.filter(r => r.assetId !== asset.id),
        ...newRecs,
      ]);
    } catch (error) {
      console.error(`Failed to generate recommendations for ${asset.id}`, error);
      // TODO: Add user-facing error toast
    } finally {
      setIsGenerating(null);
    }
  };

  const handleMarkCompleted = (id: string) => {
    setRecommendations(prev =>
      prev.map(r => (r.id === id ? { ...r, completed: true } : r))
    );
  };

  const handleDismiss = (id: string) => {
    setRecommendations(prev =>
      prev.map(r => (r.id === id ? { ...r, dismissed: true } : r))
    );
  };

  const pendingRecommendations = useMemo(() => {
    return recommendations.filter(r => !r.completed && !r.dismissed);
  }, [recommendations]);

  const filteredRecommendations = useMemo(() => {
    if (priorityFilter === 'ALL') {
      return pendingRecommendations;
    }
    return pendingRecommendations.filter(r => r.priority === priorityFilter);
  }, [pendingRecommendations, priorityFilter]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold">AI Maintenance Recommendations</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockAssets.map(asset => (
            <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                {asset.type === 'CAR' ? <Car className="h-8 w-8 text-blue-500" /> : <Zap className="h-8 w-8 text-yellow-500" />}
                <span className="font-semibold">{asset.name}</span>
              </div>
              <Button onClick={() => handleGenerate(asset)} disabled={!!isGenerating}>
                {isGenerating === asset.id ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                ) : (
                  <><Wand2 className="h-4 w-4 mr-2" /> Generate New</>
                )}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Pending Recommendations</h2>
          <Select onValueChange={(value: RecommendationPriority | 'ALL') => setPriorityFilter(value)} defaultValue="ALL">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isGenerating && recommendations.length === 0 ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.map((rec) => (
                <RecommendationCard 
                  key={rec.id} 
                  recommendation={rec} 
                  onMarkCompleted={handleMarkCompleted}
                  onDismiss={handleDismiss}
                />
              ))
            ) : (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-semibold">All Clear!</h3>
                <p className="text-muted-foreground">Generate recommendations for an asset to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;

