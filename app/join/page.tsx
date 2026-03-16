'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function JoinEvent() {
  const [joinCode, setJoinCode] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const joinEvent = async () => {
    if (!joinCode.trim() || !name.trim()) return
    setLoading(true)

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('join_code', joinCode.toUpperCase())
      .single()

    if (error || !data) {
      alert('Event not found. Check your code and try again.')
      setLoading(false)
      return
    }

    router.push(`/event/${data.id}?name=${encodeURIComponent(name)}`)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-2">Groopik</h1>
      <p className="text-gray-400 mb-10">Enter your event code to join</p>

      <div className="w-full max-w-md flex flex-col gap-4">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-white"
        />
        <input
          type="text"
          placeholder="Event code e.g. W27YXY"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          maxLength={6}
          className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-white uppercase"
        />
        <button
          onClick={joinEvent}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition"
        >
          {loading ? 'Joining...' : 'Join Event'}
        </button>
      </div>
    </main>
  )
}