'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [eventName, setEventName] = useState('')
  const [loading, setLoading] = useState(false)
  const [eventCode, setEventCode] = useState('')
  const [eventId, setEventId] = useState('')
  const [copied, setCopied] = useState(false)
  const [photoCount, setPhotoCount] = useState(2847)
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoCount(n => n + Math.floor(Math.random() * 3 + 1))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const createEvent = async () => {
    if (!eventName.trim()) return
    setLoading(true)
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const { data, error } = await supabase
      .from('events')
      .insert([{ name: eventName, join_code: joinCode }])
      .select()
    if (error) {
      alert('Error: ' + error.message)
    } else {
      setEventCode(joinCode)
      setEventId(data[0].id)
    }
    setLoading(false)
  }

  const copyLink = () => {
    const link = `${window.location.origin}/join?code=${eventCode}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tiltCard = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotX = ((y - cy) / cy) * -10
    const rotY = ((x - cx) / cx) * 10
    el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`
    el.style.boxShadow = '0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(59,130,246,0.2)'
  }

  const resetCard = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)'
    el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.7)'
  }

  const cards = [
    {
      title: 'Manali Trip', sub: '47 photos · 8 people', dot: '#4ade80',
      scene: (
        <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
          <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d1a2e"/><stop offset="55%" stopColor="#162a16"/><stop offset="100%" stopColor="#0c160c"/></linearGradient></defs>
          <rect width="200" height="120" fill="url(#g1)"/>
          <circle cx="165" cy="16" r="9" fill="rgba(255,240,200,0.1)"/>
          <circle cx="18" cy="10" r="1.5" fill="rgba(255,255,255,0.5)"/>
          <circle cx="52" cy="7" r="1" fill="rgba(255,255,255,0.4)"/>
          <circle cx="88" cy="14" r="1" fill="rgba(255,255,255,0.3)"/>
          <circle cx="125" cy="6" r="1.5" fill="rgba(255,255,255,0.4)"/>
          <polygon points="0,120 0,82 22,56 44,72 65,36 90,58 112,44 136,62 158,32 185,50 200,40 200,120" fill="#1c2e1c"/>
          <polygon points="0,120 0,92 16,78 38,90 60,70 85,84 108,68 132,82 155,64 178,76 200,66 200,120" fill="#0f180f"/>
          <polygon points="62,36 66,27 70,36" fill="rgba(255,255,255,0.14)"/>
          <polygon points="155,32 159,23 163,32" fill="rgba(255,255,255,0.1)"/>
        </svg>
      )
    },
    {
      title: 'The Wedding', sub: '213 photos · 34 people', dot: '#f97316',
      scene: (
        <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
          <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1c0f06"/><stop offset="100%" stopColor="#0e0806"/></linearGradient></defs>
          <rect width="200" height="120" fill="url(#g2)"/>
          <ellipse cx="100" cy="42" rx="65" ry="22" fill="rgba(255,160,50,0.05)"/>
          <rect x="0" y="110" width="200" height="10" fill="#0a0504"/>
          <rect x="84" y="62" width="8" height="48" fill="#0e0808"/>
          <circle cx="88" cy="57" r="8" fill="#0e0808"/>
          <rect x="100" y="66" width="7" height="44" fill="#0e0808"/>
          <circle cx="103" cy="62" r="7" fill="#0e0808"/>
          <polygon points="89,78 85,110 93,110 97,78" fill="#0e0808"/>
          <path d="M40,110 L40,40 Q40,8 100,8 Q160,8 160,40 L160,110" fill="none" stroke="rgba(255,180,80,0.1)" strokeWidth="1.5"/>
          <circle cx="56" cy="24" r="1.5" fill="rgba(255,220,100,0.55)"/>
          <circle cx="100" cy="10" r="1.5" fill="rgba(255,220,100,0.6)"/>
          <circle cx="144" cy="24" r="1.5" fill="rgba(255,220,100,0.55)"/>
        </svg>
      )
    },
    {
      title: 'Mood Fest', sub: '156 photos · 61 people', dot: '#a855f7',
      scene: (
        <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="120" fill="#06040f"/>
          <line x1="32" y1="0" x2="62" y2="120" stroke="rgba(168,85,247,0.14)" strokeWidth="28"/>
          <line x1="100" y1="0" x2="100" y2="120" stroke="rgba(236,72,153,0.1)" strokeWidth="20"/>
          <line x1="168" y1="0" x2="138" y2="120" stroke="rgba(168,85,247,0.12)" strokeWidth="24"/>
          <rect x="0" y="94" width="200" height="26" fill="#030208"/>
          <circle cx="22" cy="105" r="3" fill="rgba(255,255,255,0.1)"/>
          <circle cx="50" cy="109" r="2" fill="rgba(255,255,255,0.07)"/>
          <circle cx="80" cy="103" r="3" fill="rgba(255,255,255,0.1)"/>
          <circle cx="110" cy="107" r="2" fill="rgba(255,255,255,0.07)"/>
          <circle cx="140" cy="104" r="3" fill="rgba(255,255,255,0.1)"/>
          <circle cx="170" cy="108" r="2" fill="rgba(255,255,255,0.07)"/>
        </svg>
      )
    },
    {
      title: 'Goa Trip', sub: '134 photos · 12 people', dot: '#38bdf8',
      scene: (
        <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
          <defs><linearGradient id="g4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d1825"/><stop offset="100%" stopColor="#0a1018"/></linearGradient></defs>
          <rect width="200" height="120" fill="url(#g4)"/>
          <line x1="0" y1="60" x2="200" y2="60" stroke="rgba(255,150,80,0.07)" strokeWidth="0.8"/>
          <ellipse cx="100" cy="58" rx="42" ry="5" fill="rgba(255,150,50,0.05)"/>
          <rect x="0" y="60" width="200" height="60" fill="#050d18"/>
          <path d="M0,70 Q26,66 52,70 Q78,74 104,70 Q130,66 156,70 Q178,73 200,70" fill="none" stroke="rgba(100,160,220,0.08)" strokeWidth="1"/>
          <polygon points="78,58 82,50 86,58" fill="rgba(0,0,0,0.5)"/>
          <rect x="81" y="38" width="1.5" height="20" fill="rgba(0,0,0,0.4)"/>
          <rect x="0" y="100" width="200" height="20" fill="#0a0c08"/>
        </svg>
      )
    },
    {
      title: 'Birthday Bash', sub: '72 photos · 18 people', dot: '#fbbf24',
      scene: (
        <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="120" fill="#080503"/>
          <circle cx="28" cy="20" r="16" fill="rgba(255,180,50,0.06)"/>
          <circle cx="100" cy="16" r="20" fill="rgba(255,160,40,0.05)"/>
          <circle cx="172" cy="20" r="14" fill="rgba(255,180,50,0.06)"/>
          <rect x="52" y="82" width="96" height="34" rx="3" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          <rect x="57" y="70" width="86" height="15" rx="2" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          <rect x="66" y="50" width="5" height="21" fill="rgba(255,255,255,0.1)"/>
          <rect x="82" y="46" width="5" height="25" fill="rgba(255,255,255,0.1)"/>
          <rect x="98" y="50" width="5" height="21" fill="rgba(255,255,255,0.1)"/>
          <rect x="114" y="48" width="5" height="23" fill="rgba(255,255,255,0.1)"/>
          <ellipse cx="68" cy="48" rx="4" ry="6.5" fill="rgba(255,200,60,0.85)"/>
          <ellipse cx="68" cy="45" rx="2" ry="4" fill="rgba(255,240,150,0.9)"/>
          <ellipse cx="84" cy="44" rx="4" ry="6.5" fill="rgba(255,200,60,0.85)"/>
          <ellipse cx="84" cy="41" rx="2" ry="4" fill="rgba(255,240,150,0.9)"/>
          <ellipse cx="100" cy="48" rx="4" ry="6.5" fill="rgba(255,200,60,0.85)"/>
          <ellipse cx="100" cy="45" rx="2" ry="4" fill="rgba(255,240,150,0.9)"/>
          <ellipse cx="116" cy="46" rx="4" ry="6.5" fill="rgba(255,200,60,0.85)"/>
          <ellipse cx="116" cy="43" rx="2" ry="4" fill="rgba(255,240,150,0.9)"/>
          <circle cx="68" cy="48" r="10" fill="rgba(255,180,30,0.07)"/>
          <circle cx="84" cy="44" r="10" fill="rgba(255,180,30,0.07)"/>
          <circle cx="100" cy="48" r="10" fill="rgba(255,180,30,0.07)"/>
          <circle cx="116" cy="46" r="10" fill="rgba(255,180,30,0.07)"/>
        </svg>
      )
    },
    {
      title: 'NYE 2024', sub: '89 photos · 22 people', dot: '#ec4899',
      scene: (
        <svg viewBox="0 0 200 120" width="100%" height="120" preserveAspectRatio="xMidYMid slice">
          <defs><linearGradient id="g6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#050510"/><stop offset="100%" stopColor="#0a0a22"/></linearGradient></defs>
          <rect width="200" height="120" fill="url(#g6)"/>
          <rect x="16" y="50" width="16" height="70" fill="rgba(255,200,50,0.1)"/>
          <rect x="44" y="34" width="20" height="86" fill="rgba(255,200,50,0.08)"/>
          <rect x="76" y="20" width="26" height="100" fill="rgba(255,200,50,0.07)"/>
          <rect x="118" y="38" width="18" height="82" fill="rgba(255,200,50,0.09)"/>
          <rect x="150" y="46" width="16" height="74" fill="rgba(255,200,50,0.1)"/>
          <rect x="18" y="52" width="3" height="3" fill="rgba(255,220,100,0.5)"/>
          <rect x="46" y="36" width="3" height="3" fill="rgba(255,220,100,0.45)"/>
          <rect x="78" y="22" width="3.5" height="3.5" fill="rgba(255,220,100,0.4)"/>
          <rect x="86" y="34" width="3" height="3" fill="rgba(255,220,100,0.35)"/>
          <rect x="120" y="40" width="3" height="3" fill="rgba(255,220,100,0.45)"/>
          <rect x="152" y="48" width="3" height="3" fill="rgba(255,220,100,0.4)"/>
          <circle cx="38" cy="12" r="1.5" fill="rgba(255,255,255,0.4)"/>
          <circle cx="100" cy="8" r="2" fill="rgba(255,255,255,0.5)"/>
          <circle cx="160" cy="14" r="1.5" fill="rgba(255,255,255,0.3)"/>
          <circle cx="185" cy="8" r="1" fill="rgba(255,255,255,0.4)"/>
        </svg>
      )
    },
  ]

  const cardStyle: React.CSSProperties = {
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 16px 40px rgba(0,0,0,0.7)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    cursor: 'pointer',
  }

  return (
    <main style={{ fontFamily: "-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif", background: '#080c14', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes shimmer{0%{left:-100%}100%{left:200%}}
        @keyframes countPulse{0%,100%{opacity:0.6}50%{opacity:1}}
        input::placeholder{color:rgba(255,255,255,0.2);}
        input:focus{outline:none;}
      `}</style>

      {/* Grid background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.025) 1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none', zIndex: 0 }} />

      {/* Blue ambient glow */}
      <div style={{ position: 'fixed', top: -120, right: -80, width: 480, height: 480, background: 'radial-gradient(circle,rgba(59,130,246,0.07) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Nav */}
      <nav style={{ position: 'relative', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64, borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="32" height="32" viewBox="0 0 44 44">
            <rect x="2" y="2" width="40" height="40" rx="10" fill="#3b82f6"/>
            <path d="M28,14 Q22,10 16,14 Q10,18 10,22 Q10,26 14,29 Q18,32 23,31 Q27,30 28,27 L28,22 L22,22" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.04em', color: 'white', lineHeight: 1 }}>GROOPIK</div>
            <div style={{ fontSize: 8, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', marginTop: 1 }}>Collect every moment</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <span onClick={() => router.push('/join')} style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Join event</span>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.08)' }} />
          <button style={{ position: 'relative', overflow: 'hidden', background: '#3b82f6', border: 'none', color: 'white', padding: '8px 20px', borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
            Create Event
          </button>
        </div>
      </nav>

      {!eventCode ? (
        <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'grid', gridTemplateColumns: '460px 1fr', alignItems: 'center', padding: '0 48px', gap: 0, maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

          {/* Left */}
          <div style={{ paddingRight: 48, opacity: 0, animation: 'fadeUp 0.6s ease 0.1s forwards' }}>

            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.16)', borderRadius: 100, padding: '5px 14px', marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', animation: 'blink 2s infinite', flexShrink: 0, boxShadow: '0 0 5px #3b82f6' }} />
              <span style={{ fontSize: 10, color: 'rgba(100,160,255,0.9)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>Free · No account needed</span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.05em', color: 'white', lineHeight: 1.02, margin: '0 0 20px' }}>
              The photos you<br />almost never got.
            </h1>

            {/* Sub */}
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.38)', lineHeight: 1.85, margin: '0 0 36px', maxWidth: 360 }}>
              Create an event. Share the link.<br />Everyone uploads. One gallery — yours to keep.
            </p>

            {/* Input label */}
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>What are you celebrating?</div>

            {/* Input + button */}
            <div id="inputWrap" style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', transition: 'border-color 0.2s', maxWidth: 400 }}>
              <input
                placeholder="Manali Trip, Rahul's Wedding..."
                value={eventName}
                onChange={e => setEventName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createEvent()}
                onFocus={e => { (e.target.parentElement as HTMLElement).style.borderColor = 'rgba(59,130,246,0.4)' }}
                onBlur={e => { (e.target.parentElement as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
                style={{ flex: 1, padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: 'none', color: 'white', fontSize: 13, fontFamily: 'inherit', minWidth: 0 }}
              />
              <button
                onClick={createEvent}
                disabled={loading || !eventName.trim()}
                style={{ background: eventName.trim() ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.08)', color: eventName.trim() ? 'white' : 'rgba(255,255,255,0.25)', padding: '14px 20px', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: eventName.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
                {loading ? 'Creating...' : 'Create →'}
              </button>
            </div>

            {/* Trust row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 18, flexWrap: 'wrap' }}>
              {['No account', 'Free forever', 'Share via QR'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="13" height="13" viewBox="0 0 13 13">
                    <circle cx="6.5" cy="6.5" r="5.5" fill="none" stroke="rgba(59,130,246,0.35)" strokeWidth="1"/>
                    <path d="M4,6.5 L5.5,8 L9,5" stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>{t}</span>
                </div>
              ))}
              <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: 11, color: 'rgba(59,130,246,0.6)', animation: 'countPulse 3s ease-in-out infinite' }}>
                {photoCount.toLocaleString()} photos shared today
              </span>
            </div>
          </div>

          {/* Right: cards */}
          <div style={{ opacity: 0, animation: 'fadeUp 0.6s ease 0.3s forwards' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, maxWidth: 420, margin: '0 auto' }}>
              {cards.map((card, i) => (
                <div key={i} style={cardStyle} onMouseMove={tiltCard} onMouseLeave={resetCard}>
                  <div style={{ overflow: 'hidden' }}>
                    {card.scene}
                  </div>
                  <div style={{ background: '#0d1421', borderTop: '1px solid rgba(59,130,246,0.08)', padding: '9px 11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.88)' }}>{card.title}</div>
                      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>{card.sub}</div>
                    </div>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: card.dot, boxShadow: `0 0 5px ${card.dot}`, flexShrink: 0 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center', animation: 'fadeUp 0.6s ease forwards' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Event ready</p>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em', color: 'white', marginBottom: 24 }}>{eventName}</h2>
          <div style={{ width: '100%', maxWidth: 400, background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 16, padding: '32px 24px', marginBottom: 20 }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Join code</p>
            <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: '0.1em', color: 'white', fontFamily: 'monospace' }}>{eventCode}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 400 }}>
            <button onClick={copyLink} style={{ width: '100%', padding: 14, background: copied ? 'rgba(74,222,128,0.1)' : '#3b82f6', border: copied ? '1px solid rgba(74,222,128,0.3)' : 'none', color: copied ? '#4ade80' : 'white', fontWeight: 800, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 6, transition: 'all 0.2s' }}>
              {copied ? '✓ Link Copied' : 'Copy Join Link'}
            </button>
            <button onClick={() => router.push(`/event/${eventId}?name=Host`)} style={{ width: '100%', padding: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'white', fontWeight: 800, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 6 }}>
              Open My Event
            </button>
            <button onClick={() => { setEventCode(''); setEventName(''); setEventId('') }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.15)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4 }}>
              Create another event
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.05)', padding: '14px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 32 }}>
          {['No install', 'Instant gallery', 'Share via QR'].map(t => (
            <span key={t} style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>{t}</span>
          ))}
        </div>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>© 2025 Groopik</span>
      </div>
    </main>
  )
}