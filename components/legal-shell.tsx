import Link from 'next/link'
import { BrandMark, SiteFooter } from '@/components/brand'
import './legal.css'

export function LegalShell({
  title,
  updated,
  crossLinkHref,
  crossLinkLabel,
  children,
}: {
  title: string
  updated: string
  crossLinkHref: string
  crossLinkLabel: string
  children: React.ReactNode
}) {
  return (
    <main className="legal-page">
      <nav className="g-nav">
        <BrandMark />
        <div className="g-nav-actions">
          <Link href="/" className="g-btn g-btn-secondary">← Back</Link>
        </div>
      </nav>

      <div className="legal-content g-animate-in">
        <header className="legal-header">
          <span className="g-badge">Legal</span>
          <h1 className="legal-title">{title}</h1>
          <p className="legal-updated">{updated}</p>
        </header>

        <hr className="legal-rule" />

        <article className="legal-body">{children}</article>

        <hr className="legal-rule" />

        <div className="legal-actions">
          <Link href={crossLinkHref} className="g-btn g-btn-secondary">{crossLinkLabel} →</Link>
          <Link href="/" className="g-btn g-btn-ghost">Back to Groopik</Link>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
