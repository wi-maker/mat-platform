'use client'

import { type ReminderWithAsset } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Calendar, Edit, Check, X, MoreVertical, Trash, Tag } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format, formatDistanceToNow, isPast, addDays, addWeeks } from 'date-fns'

interface ReminderCardProps {
  reminder: ReminderWithAsset;
  onComplete: (id: string) => void;
  onSnooze: (id: string, duration: 'day' | 'week') => void;
  onEdit: (reminder: ReminderWithAsset) => void;
  onDelete: (id: string) => void;
  isProcessing: boolean;
}

const priorityStyles = {
  HIGH: 'bg-red-500 hover:bg-red-600',
  MEDIUM: 'bg-yellow-500 hover:bg-yellow-600',
  LOW: 'bg-green-500 hover:bg-green-600',
}

export function ReminderCard({ reminder, onComplete, onSnooze, onEdit, onDelete, isProcessing }: ReminderCardProps) {
  const dueDate = new Date(reminder.nextDue)
  const isOverdue = isPast(dueDate)

  return (
    <Card className={`w-full h-full flex flex-col transition-all shadow-sm hover:shadow-lg ${isOverdue ? 'border-red-500/50' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{reminder.title}</CardTitle>
          <Badge className={`text-white ${priorityStyles[reminder.priority]}`}>{reminder.priority}</Badge>
        </div>
        <CardDescription>{reminder.asset ? `${reminder.asset.name} - ${reminder.asset.type}` : 'Asset not found'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        {reminder.description && <p className="text-sm text-muted-foreground">{reminder.description}</p>}
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          <span>Due on {format(dueDate, 'PPP')}</span>
        </div>
        <div className={`flex items-center text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-primary'}`}>
          <Clock className="mr-2 h-4 w-4" />
          <span>{isOverdue ? 'Overdue by' : 'Due in'} {formatDistanceToNow(dueDate, { addSuffix: !isOverdue })}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Tag className="mr-2 h-4 w-4" />
          <span>Repeats {reminder.frequency.toLowerCase()}</span>
        </div>
      </CardContent>
            <CardFooter className="flex items-center justify-between pt-4 mt-auto">
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onComplete(reminder.id)} disabled={isProcessing}>
            <Check className="h-4 w-4 mr-2" /> Complete
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(reminder)} disabled={isProcessing}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={isProcessing}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSnooze(reminder.id, 'day')}>
              <Clock className="mr-2 h-4 w-4" />
              <span>Snooze 1 Day <span className="text-xs text-muted-foreground ml-2">{format(addDays(new Date(), 1), 'MMM d')}</span></span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSnooze(reminder.id, 'week')}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Snooze 1 Week <span className="text-xs text-muted-foreground ml-2">{format(addWeeks(new Date(), 1), 'MMM d')}</span></span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-50"
              onClick={() => onDelete(reminder.id)}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}

