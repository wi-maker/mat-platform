'use client'

import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { type ReminderWithAsset } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ReminderCalendarProps {
  reminders: ReminderWithAsset[]
}

export function ReminderCalendar({ reminders }: ReminderCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>()

  const eventDays = reminders.map(r => new Date(r.nextDue))

  const remindersForSelectedDay = reminders.filter(r => {
    if (!selectedDay) return false
    return new Date(r.nextDue).toDateString() === selectedDay.toDateString()
  })

  return (
    <Card>
      <CardContent className="p-4 md:p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0 mx-auto">
          <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            modifiers={{ event: eventDays }}
            modifiersStyles={{
              event: { color: 'white', backgroundColor: '#0ea5e9' },
            }}
            className="rounded-md border shadow-sm"
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            {selectedDay ? `Reminders for ${selectedDay.toLocaleDateString()}` : 'Select a day to see reminders'}
          </h3>
          <div className="space-y-3 h-64 overflow-y-auto pr-2">
            {selectedDay && remindersForSelectedDay.length > 0 ? (
              remindersForSelectedDay.map(reminder => (
                <div key={reminder.id} className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold">{reminder.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Asset: {reminder.asset ? reminder.asset.name : '(Asset not found)'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground pt-4">
                {selectedDay ? 'No reminders for this day.' : ' '}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
