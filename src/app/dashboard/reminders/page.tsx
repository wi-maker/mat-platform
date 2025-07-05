'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ReminderCard } from '@/components/reminders/reminder-card'
import { ReminderForm } from '@/components/reminders/reminder-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { ReminderCalendar } from '@/components/reminders/reminder-calendar'
import { type ReminderWithAsset, type Asset } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

// The API now returns reminders with asset data included

export default function RemindersPage() {
    const [reminders, setReminders] = useState<ReminderWithAsset[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('list');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [reminderToEdit, setReminderToEdit] = useState<ReminderWithAsset | null>(null);
  const [reminderToDelete, setReminderToDelete] = useState<string | null>(null); 
  const router = useRouter()

  useEffect(() => {
        async function fetchReminders() {
      console.log('Fetching reminders...');
      setIsLoading(true);
      try {
        const response = await fetch('/api/reminders');
        console.log('API Response Object:', response);

        if (!response.ok) {
          throw new Error(`Failed to fetch reminders: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Reminders data (JSON):', data);
        console.log('Reminders array:', data.reminders);
        console.log('Reminders length:', data.reminders?.length);

        setReminders(data.reminders || []);
        // We can fetch assets separately if needed for the form, but not for the main list

      } catch (error) { 
        console.error('Fetch Error:', error);
        toast.error('Could not load reminders', { description: 'Please try again later.' });
      } finally {
        setIsLoading(false);
      }
    }

    fetchReminders();
  }, []);

  const filteredReminders = useMemo(() => {
    const now = new Date();
    return reminders.filter(reminder => {
      if (filter === 'overdue') {
        return new Date(reminder.nextDue) < now && !reminder.completedAt;
      }
      if (filter === 'upcoming') {
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        return new Date(reminder.nextDue) >= now && new Date(reminder.nextDue) <= nextWeek && !reminder.completedAt;
      }
      // 'all' filter
      return !reminder.completedAt;
    });
  }, [reminders, filter]);

  const handleAction = async (action: Promise<any>) => {
    try {
      await action;
    } catch (error) { 
      console.error("Action failed", error);
      toast.error('An unexpected error occurred.');
    } finally {
      setProcessingId(null);
    }
  }

  const handleCompleteAction = (id: string) => {
    setProcessingId(id);
    handleAction(new Promise(res => setTimeout(() => {
      setReminders(prev => prev.filter(r => r.id !== id));
      toast.success('Reminder marked as complete!');
      res(true);
    }, 1000)));
  }

  const handleSnoozeAction = (id: string, duration: 'day' | 'week') => {
    setProcessingId(id);
    handleAction(new Promise(res => setTimeout(() => {
      const newDueDate = new Date();
      newDueDate.setDate(newDueDate.getDate() + (duration === 'day' ? 1 : 7));
      setReminders(prev => prev.map(r => r.id === id ? { ...r, nextDue: newDueDate.toISOString() } : r));
      toast.success(`Reminder snoozed for 1 ${duration}!`);
      res(true);
    }, 1000)));
  }

  const handleDeleteConfirmation = (id: string) => {
    setReminderToDelete(id);
  }

  const handleDeleteAction = () => {
    if (!reminderToDelete) return;
    setProcessingId(reminderToDelete);
    setReminderToDelete(null);
    handleAction(new Promise(res => setTimeout(() => {
      setReminders(prev => prev.filter(r => r.id !== reminderToDelete));
      toast.success('Reminder deleted.');
      res(true);
    }, 1000)));
  }

  const handleEditAction = (reminder: ReminderWithAsset) => {
    setReminderToEdit(reminder);
  }

  const handleFormSubmit = async (values: any) => {
    if (!reminderToEdit) return;
    setProcessingId(reminderToEdit.id);
    console.log("Submitting form for reminder:", reminderToEdit.id, values);
    
    await handleAction(new Promise(res => setTimeout(() => {
      setReminders(prev => prev.map(r => r.id === reminderToEdit.id ? { ...r, ...values, asset: r.asset } : r));
      toast.success('Reminder updated successfully!');
      setReminderToEdit(null);
      res(true);
    }, 1000)));
  }

  // Debug logging for component state on each render
  console.log('--- RENDER CYCLE ---');
  console.log('Loading state:', isLoading);
  console.log('Current reminders state:', reminders);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Reminders</h1>
          <p className="text-muted-foreground">Stay on top of your asset maintenance schedule.</p>
        </div>
        <Link href="/dashboard/reminders/new" passHref>
          <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Reminder</Button>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex space-x-2">
          <Button variant={filter === 'all' ? 'secondary' : 'ghost'} onClick={() => setFilter('all')}>All</Button>
          <Button variant={filter === 'overdue' ? 'secondary' : 'ghost'} onClick={() => setFilter('overdue')}>Overdue</Button>
          <Button variant={filter === 'upcoming' ? 'secondary' : 'ghost'} onClick={() => setFilter('upcoming')}>Upcoming (7 days)</Button>
        </div>
        <div className="flex space-x-2">
          <Button variant={view === 'list' ? 'secondary' : 'ghost'} onClick={() => setView('list')}>List</Button>
          <Button variant={view === 'calendar' ? 'secondary' : 'ghost'} onClick={() => setView('calendar')}>Calendar</Button>
        </div>
      </div>

      {isLoading ? (
        <div>Loading reminders...</div>
      ) : (
        <div>
          {view === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReminders.length > 0 ? (
                filteredReminders.map(reminder => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onComplete={handleCompleteAction}
                    onSnooze={handleSnoozeAction}
                    onEdit={handleEditAction}
                    onDelete={handleDeleteConfirmation}
                    isProcessing={processingId === reminder.id}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <h2 className="text-xl font-semibold">No reminders here!</h2>
                  <p className="text-muted-foreground mt-2">Looks like you're all caught up. Add a new reminder to get started.</p>
                </div>
              )}
            </div>
          ) : (
            <ReminderCalendar reminders={filteredReminders} />
          )}
        </div>
      )}

      {/* Edit Reminder Dialog */}
    <Dialog open={!!reminderToEdit} onOpenChange={(isOpen) => !isOpen && setReminderToEdit(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Reminder</DialogTitle>
        </DialogHeader>
        {reminderToEdit && (
          <ReminderForm 
            assets={assets}
            initialData={reminderToEdit}
            onSubmit={handleFormSubmit}
            isSubmitting={processingId === reminderToEdit.id}
          />
        )}
      </DialogContent>
    </Dialog>

    {/* Delete Confirmation Dialog */}
    <AlertDialog open={!!reminderToDelete} onOpenChange={(isOpen) => !isOpen && setReminderToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the reminder.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteAction}>Delete</AlertDialogAction>
        </AlertDialogFooter>
              </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
