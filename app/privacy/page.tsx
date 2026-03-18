'use client'

import { useRouter } from 'next/navigation'

export default function Privacy() {
  const router = useRouter()

  return (
    <main style={{ fontFamily: "-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif", background: '#080c14', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        h2{font-size:18px;font-weight:700;color:white;letter-spacing:-0.03em;margin:32px 0 12px;}
        p{font-size:14px;color:rgba(255,255,255,0.45);line-height:1.9;margin:0 0 12px;}
        ul{padding-left:20px;margin:0 0 12px;}
        li{font-size:14px;color:rgba(255,255,255,0.45);line-height:1.9;}
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
        <button onClick={() => router.back()} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', padding: '8px 20px', borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
          ← Back
        </button>
      </nav>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 720, margin: '0 auto', width: '100%', padding: '56px 48px', boxSizing: 'border-box', opacity: 0, animation: 'fadeUp 0.6s ease 0.1s forwards' }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.16)', borderRadius: 100, padding: '5px 14px', marginBottom: 20 }}>
            <span style={{ fontSize: 10, color: 'rgba(100,160,255,0.9)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Legal</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.05em', color: 'white', lineHeight: 1.02, margin: '0 0 12px' }}>Privacy Policy</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', margin: 0 }}>Last updated: March 2025 · Effective immediately</p>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 40 }} />

        <h2>1. What We Collect</h2>
        <p>Groopik collects minimal information to operate the service:</p>
        <ul>
          <li>The name you provide when joining an event</li>
          <li>Photos you choose to upload to an event</li>
          <li>A session token stored in your browser to identify your uploads</li>
          <li>Basic usage data such as event creation and upload timestamps</li>
        </ul>
        <p>We do not collect email addresses, phone numbers, or any personal identification unless you voluntarily provide them.</p>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect solely to:</p>
        <ul>
          <li>Display your name alongside photos you upload</li>
          <li>Allow you to manage and delete your own photos</li>
          <li>Operate and improve the Groopik service</li>
          <li>Prevent abuse and ensure platform safety</li>
        </ul>
        <p>We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>

        <h2>3. Photo Storage</h2>
        <p>Photos uploaded to Groopik are stored securely using Supabase cloud infrastructure hosted in South Asia (Mumbai). Photos are accessible to all members of the event they were uploaded to. Photos are not shared outside of the event group.</p>
        <p>Event photos may be automatically deleted after 30 days of inactivity. You can delete your photos at any time.</p>

        <h2>4. Cookies and Local Storage</h2>
        <p>Groopik uses browser local storage to save your session token. This allows you to manage your uploads when you return to an event. We do not use advertising cookies or tracking cookies of any kind.</p>

        <h2>5. Third Party Services</h2>
        <p>Groopik uses the following third party services to operate:</p>
        <ul>
          <li><strong style={{ color: 'rgba(255,255,255,0.7)' }}>Supabase</strong> — database and file storage</li>
          <li><strong style={{ color: 'rgba(255,255,255,0.7)' }}>Vercel</strong> — application hosting and deployment</li>
        </ul>
        <p>These services have their own privacy policies which govern their data handling practices.</p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Delete any photos you have uploaded at any time</li>
          <li>Request deletion of all your data by contacting us</li>
          <li>Know what data we hold about you</li>
        </ul>

        <h2>7. Children's Privacy</h2>
        <p>Groopik is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately.</p>

        <h2>8. Data Security</h2>
        <p>We take reasonable measures to protect your data including secure HTTPS connections, access controls on our database, and session-based authentication for photo management. However no system is completely secure and we cannot guarantee absolute security.</p>

        <h2>9. Changes to This Policy</h2>
        <p>We may update this privacy policy from time to time. We will notify users of significant changes. Continued use of Groopik after changes constitutes acceptance of the updated policy.</p>

        <h2>10. Compliance with Indian Law</h2>
        <p>This privacy policy is compliant with the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 of India.</p>

        <h2>11. Contact</h2>
        <p>If you have questions about this privacy policy or want to exercise your rights, please contact us. We will respond within 30 days.</p>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '48px 0 32px' }} />

        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={() => router.push('/terms')} style={{ padding: '12px 24px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, fontSize: 12, fontWeight: 700, color: 'rgba(100,160,255,0.8)', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
            Read Terms of Service →
          </button>
          <button onClick={() => router.push('/')} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
            Back to Groopik
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.05)', padding: '14px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
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