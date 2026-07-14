'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
      <rect x="2" y="2" width="40" height="40" rx="12" fill="var(--sunset)" />
      <path
        d="M28,14 Q22,10 16,14 Q10,18 10,22 Q10,26 14,29 Q18,32 23,31 Q27,30 28,27 L28,22 L22,22"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <Link href="/" className="g-nav-logo">
      <Logo size={size} />
      <span className="g-nav-brand">groopik</span>
    </Link>
  )
}

const emptySubscribe = () => () => {}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  // true only after hydration, so server and first client render agree
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  if (!mounted) return <span className="g-theme-toggle" aria-hidden="true" />

  const dark = resolvedTheme === 'dark'
  return (
    <button
      className="g-theme-toggle"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
    >
      {dark ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M13 3l-1.4 1.4M4.4 11.6L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

export function SiteFooter() {
  return (
    <footer className="g-footer">
      <div className="g-footer-links">
        <Link href="/terms" className="g-footer-link">Terms</Link>
        <Link href="/privacy" className="g-footer-link">Privacy</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <span className="g-footer-copy">© {new Date().getFullYear()} Groopik</span>
        <ThemeToggle />
      </div>
    </footer>
  )
}
