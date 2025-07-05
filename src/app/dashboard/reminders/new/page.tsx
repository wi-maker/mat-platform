'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ReminderForm } from '@/components/reminders/reminder-form'
import { type Asset } from '@/lib/supabase'
import { toast } from 'sonner'

export default function NewReminderPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  

  useEffect(() => {
    async function fetchAssets() {
      try {
        const response = await fetch('/api/assets')
        if (!response.ok) {
          throw new Error('Failed to fetch assets')
        }
        const data = await response.json()
        setAssets(data)
      } catch (error) {
        console.error(error)
        toast.error('Could not load your assets', {
          description: 'Please try again later.',
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchAssets()
  }, [toast])

  async function onSubmit(values: any) {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          nextDue: values.nextDue.toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create reminder')
      }

      toast.success('Reminder Created!', {
        description: 'Your new reminder has been successfully added.',
      })
      router.push('/dashboard/reminders')
      router.refresh() // Ensures the reminders list is updated
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong', {
        description: 'Your reminder could not be saved. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div>Loading assets...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create a New Reminder</h1>
        <p className="text-muted-foreground mb-8">
          Set up a new maintenance reminder for one of your assets. Regular reminders help prevent costly repairs.
        </p>
        <ReminderForm assets={assets} onSubmit={onSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
}
