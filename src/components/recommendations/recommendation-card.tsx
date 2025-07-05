import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, X, Clock, DollarSign, AlertTriangle, Info, Wrench } from 'lucide-react'
import { MaintenanceRecommendation } from '@/lib/ai'

interface RecommendationCardProps {
  recommendation: MaintenanceRecommendation
  onMarkCompleted?: (id: string) => void
  onDismiss?: (id: string) => void
}

export function RecommendationCard({ 
  recommendation, 
  onMarkCompleted, 
  onDismiss 
}: RecommendationCardProps) {
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH': return <AlertTriangle className="w-4 h-4" />
      case 'MEDIUM': return <Clock className="w-4 h-4" />
      case 'LOW': return <Info className="w-4 h-4" />
      default: return <Wrench className="w-4 h-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'URGENT': return '🚨'
      case 'PREVENTIVE': return '🛡️'
      case 'ROUTINE': return '🔧'
      case 'SEASONAL': return '📅'
      default: return '⚙️'
    }
  }

  if (recommendation.completed) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg line-through text-green-700">
                {recommendation.title}
              </CardTitle>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Completed
            </Badge>
          </div>
        </CardHeader>
      </Card>
    )
  }

  if (recommendation.dismissed) {
    return null // Don't show dismissed recommendations
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getCategoryIcon(recommendation.category)}</span>
            <CardTitle className="text-lg">{recommendation.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${getPriorityColor(recommendation.priority)} flex items-center gap-1`}
            >
              {getPriorityIcon(recommendation.priority)}
              {recommendation.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          {recommendation.description}
        </p>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {recommendation.estimatedCost && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{recommendation.estimatedCost}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recommendation.timeframe}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => onMarkCompleted?.(recommendation.id)}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Mark Done
          </Button>
          
          <Button 
            onClick={() => onDismiss?.(recommendation.id)}
            variant="outline" 
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="w-4 h-4 mr-1" />
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
