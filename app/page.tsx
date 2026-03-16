'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [eventName, setEventName] = useState('')
  const [loading, setLoading] = useState(false)
  const [eventCode, setEventCode] = useState('')

  const createEvent = async () => {
    if (!eventName.trim()) return
    setLoading(true)

    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    const { data, error } = await supabase
      .from('events')
      .insert([{ name: eventName, join_code: joinCode }])
      .select()

    if (error) {
      alert('Error creating event: ' + error.message)
    } else {
      setEventCode(joinCode)
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-2">Groopik</h1>
      <p className="text-gray-400 mb-10">Collect everyone's photos in one place</p>

      {!eventCode ? (
        <div className="w-full max-w-md flex flex-col gap-4">
          <input
            type="text"
            placeholder="Event name e.g. Manali Trip"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-white"
          />
          <button
            onClick={createEvent}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition"
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col items-center gap-4">
          <p className="text-gray-400">Your event is ready. Share this code:</p>
          <div className="text-5xl font-bold tracking-widest text-white">{eventCode}</div>
          <p className="text-gray-500 text-sm">Anyone with this code can join and upload photos</p>
          <button
            onClick={() => { setEventCode(''); setEventName('') }}
            className="mt-4 text-gray-400 underline text-sm"
          >
            Create another event
          </button>
        </div>
      )}
    </main>
  )
}