'use client'

import { useRouter } from 'next/navigation'

export default function Terms() {
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

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.16)', borderRadius: 100, padding: '5px 14px', marginBottom: 20 }}>
            <span style={{ fontSize: 10, color: 'rgba(100,160,255,0.9)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Legal</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.05em', color: 'white', lineHeight: 1.02, margin: '0 0 12px' }}>Terms of Service</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', margin: 0 }}>Last updated: March 2025 · Effective immediately</p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 40 }} />

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using Groopik, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform. These terms apply to all users including event creators and guests.</p>

        <h2>2. What Groopik Does</h2>
        <p>Groopik is a photo sharing platform that allows groups of people to collect and share photos from shared events. Users can create events, join events via a code or link, upload photos, and download photos from the shared gallery.</p>

        <h2>3. User Responsibilities</h2>
        <p>By using Groopik you agree that:</p>
        <ul>
          <li>You will only upload photos that you own or have explicit permission to share</li>
          <li>You will not upload illegal, harmful, obscene, or inappropriate content</li>
          <li>You will not upload photos of individuals without their consent</li>
          <li>You will not use Groopik for any unlawful purpose</li>
          <li>You are responsible for the content you upload</li>
          <li>You will not attempt to gain unauthorized access to other users' content</li>
        </ul>

        <h2>4. Content Ownership</h2>
        <p>You retain full ownership of all photos you upload to Groopik. By uploading photos, you grant Groopik a limited, non-exclusive license to store and display your photos solely for the purpose of operating the service. We do not claim ownership of your content and we do not sell your photos to any third party.</p>

        <h2>5. Content Removal</h2>
        <p>You may delete photos you have uploaded at any time. Groopik reserves the right to remove any content that violates these terms without prior notice. If you believe content has been posted in violation of your rights, please contact us immediately.</p>

        <h2>6. Privacy</h2>
        <p>Your privacy is important to us. Please review our <span onClick={() => router.push('/privacy')} style={{ color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}>Privacy Policy</span> which explains how we collect, use, and protect your information.</p>

        <h2>7. Prohibited Content</h2>
        <p>The following content is strictly prohibited on Groopik:</p>
        <ul>
          <li>Sexually explicit or pornographic material</li>
          <li>Content that exploits or harms minors in any way</li>
          <li>Content that promotes violence, hatred, or discrimination</li>
          <li>Copyrighted material without proper authorization</li>
          <li>Private photos shared without the subject's consent</li>
          <li>Any content that violates applicable laws</li>
        </ul>

        <h2>8. Disclaimer of Warranties</h2>
        <p>Groopik is provided on an "as is" basis without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or secure. We are not responsible for any loss of data or content.</p>

        <h2>9. Limitation of Liability</h2>
        <p>Groopik and its creators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability to you shall not exceed the amount you have paid us in the past 12 months, which for a free service is zero.</p>

        <h2>10. Changes to Terms</h2>
        <p>We reserve the right to update these terms at any time. Continued use of Groopik after changes constitutes acceptance of the new terms. We will make reasonable efforts to notify users of significant changes.</p>

        <h2>11. Governing Law</h2>
        <p>These terms are governed by the laws of India. Any disputes arising from these terms shall be subject to the jurisdiction of courts in India, in accordance with the Information Technology Act, 2000 and its amendments.</p>

        <h2>12. Contact</h2>
        <p>If you have any questions about these terms, please contact us. We are committed to resolving any concerns promptly and fairly.</p>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '48px 0 32px' }} />

        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={() => router.push('/privacy')} style={{ padding: '12px 24px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, fontSize: 12, fontWeight: 700, color: 'rgba(100,160,255,0.8)', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
            Read Privacy Policy →
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