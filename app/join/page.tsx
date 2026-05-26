'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function JoinContent() {
  const [joinCode, setJoinCode] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) setJoinCode(code.toUpperCase())
  }, [searchParams])

  const joinEvent = async () => {
    if (!joinCode.trim() || !name.trim() || !agreed) return
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

    const storageKey = `groopik_${data.id}_${name.trim().toLowerCase()}`
    let sessionToken = localStorage.getItem(storageKey)
    if (!sessionToken) {
      sessionToken = `${name.trim().toLowerCase()}_${Math.random().toString(36).substring(2)}_${Date.now().toString(36)}`
      localStorage.setItem(storageKey, sessionToken)
    }

    router.push(`/event/${data.id}?name=${encodeURIComponent(name.trim())}&token=${sessionToken}`)
    setLoading(false)
  }

  const ready = joinCode.trim() && name.trim() && agreed

  return (
    <main style={{ fontFamily: "-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif", background: '#080c14', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.4}}
        input::placeholder{color:rgba(255,255,255,0.2);}
        input:focus{outline:none;}
      `}</style>

      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.025) 1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: -120, right: -80, width: 480, height: 480, background: 'radial-gradient(circle,rgba(59,130,246,0.07) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Nav */}
      <nav style={{ position: 'relative', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64, borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div onClick={() => router.push('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <svg width="32" height="32" viewBox="0 0 44 44">
            <rect x="2" y="2" width="40" height="40" rx="10" fill="#3b82f6"/>
            <path d="M28,14 Q22,10 16,14 Q10,18 10,22 Q10,26 14,29 Q18,32 23,31 Q27,30 28,27 L28,22 L22,22" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.04em', color: 'white', lineHeight: 1 }}>GROOPIK</div>
            <div style={{ fontSize: 8, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', marginTop: 1 }}>Collect every moment</div>
          </div>
        </div>
        <button onClick={() => router.push('/')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', padding: '8px 20px', borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
          ← Create event
        </button>
      </nav>

      {/* Main */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420, opacity: 0, animation: 'fadeUp 0.6s ease 0.1s forwards' }}>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.16)', borderRadius: 100, padding: '5px 14px', marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', animation: 'blink 2s infinite', flexShrink: 0, boxShadow: '0 0 5px #3b82f6' }} />
            <span style={{ fontSize: 10, color: 'rgba(100,160,255,0.9)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Join an event</span>
          </div>

          <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.05em', color: 'white', lineHeight: 1.02, margin: '0 0 12px' }}>
            You're invited.
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8, margin: '0 0 36px' }}>
            Enter your name and the event code<br />to join the shared gallery.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your name</div>
              <input
                placeholder="e.g. John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'white', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Code */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Event code</div>
              <input
                placeholder="e.g. W27YXY"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && joinEvent()}
                maxLength={6}
                style={{ width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'white', fontSize: 20, fontFamily: 'monospace', letterSpacing: '0.2em', boxSizing: 'border-box', textTransform: 'uppercase', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Agreement */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0' }}>
              <div
                onClick={() => setAgreed(!agreed)}
                style={{ width: 18, height: 18, borderRadius: 5, background: agreed ? '#3b82f6' : 'transparent', border: agreed ? '2px solid #3b82f6' : '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginTop: 2, transition: 'all 0.15s ease' }}>
                {agreed && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.6, margin: 0, cursor: 'pointer' }} onClick={() => setAgreed(!agreed)}>
                I agree to the{' '}
                <span onClick={e => { e.stopPropagation(); router.push('/terms') }} style={{ color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}>Terms of Service</span>
                {' '}and{' '}
                <span onClick={e => { e.stopPropagation(); router.push('/privacy') }} style={{ color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}>Privacy Policy</span>
                . I confirm I own or have permission to share any photos I upload.
              </p>
            </div>

            {/* Button */}
            <button
              onClick={joinEvent}
              disabled={loading || !ready}
              style={{ width: '100%', padding: 15, background: ready ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, color: ready ? 'white' : 'rgba(255,255,255,0.2)', fontWeight: 800, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: ready ? 'pointer' : 'not-allowed', fontFamily: 'inherit', marginTop: 4, transition: 'all 0.2s' }}>
              {loading ? 'Finding event...' : 'Join Event →'}
            </button>
          </div>

          <p style={{ marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.15)', textAlign: 'center', letterSpacing: '0.04em' }}>
            No account needed · Your photos stay yours
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.05)', padding: '14px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 24 }}>
          {['No install', 'Instant gallery', 'Share via QR'].map(t => (
            <span key={t} style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>{t}</span>
          ))}
          <span onClick={() => router.push('/terms')} style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer' }}>Terms</span>
          <span onClick={() => router.push('/privacy')} style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer' }}>Privacy</span>
        </div>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>© 2025 Groopik</span>
      </div>
    </main>
  )
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div style={{ background: '#080c14', minHeight: '100vh' }} />}>
      <JoinContent />
    </Suspense>
  )
}
