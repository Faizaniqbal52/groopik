import Link from 'next/link'
import { LegalShell } from '@/components/legal-shell'

export const metadata = { title: 'Terms of Service — Groopik' }

export default function Terms() {
  return (
    <LegalShell
      title="Terms of Service"
      updated="Last updated: March 2025 · Effective immediately"
      crossLinkHref="/privacy"
      crossLinkLabel="Read Privacy Policy"
    >
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
        <li>You will not attempt to gain unauthorized access to other users&apos; content</li>
      </ul>

      <h2>4. Content Ownership</h2>
      <p>You retain full ownership of all photos you upload to Groopik. By uploading photos, you grant Groopik a limited, non-exclusive license to store and display your photos solely for the purpose of operating the service. We do not claim ownership of your content and we do not sell your photos to any third party.</p>

      <h2>5. Content Removal</h2>
      <p>You may delete photos you have uploaded at any time. Groopik reserves the right to remove any content that violates these terms without prior notice. If you believe content has been posted in violation of your rights, please contact us immediately.</p>

      <h2>6. Privacy</h2>
      <p>Your privacy is important to us. Please review our <Link href="/privacy">Privacy Policy</Link> which explains how we collect, use, and protect your information.</p>

      <h2>7. Prohibited Content</h2>
      <p>The following content is strictly prohibited on Groopik:</p>
      <ul>
        <li>Sexually explicit or pornographic material</li>
        <li>Content that exploits or harms minors in any way</li>
        <li>Content that promotes violence, hatred, or discrimination</li>
        <li>Copyrighted material without proper authorization</li>
        <li>Private photos shared without the subject&apos;s consent</li>
        <li>Any content that violates applicable laws</li>
      </ul>

      <h2>8. Disclaimer of Warranties</h2>
      <p>Groopik is provided on an &quot;as is&quot; basis without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or secure. We are not responsible for any loss of data or content.</p>

      <h2>9. Limitation of Liability</h2>
      <p>Groopik and its creators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability to you shall not exceed the amount you have paid us in the past 12 months, which for a free service is zero.</p>

      <h2>10. Changes to Terms</h2>
      <p>We reserve the right to update these terms at any time. Continued use of Groopik after changes constitutes acceptance of the new terms. We will make reasonable efforts to notify users of significant changes.</p>

      <h2>11. Governing Law</h2>
      <p>These terms are governed by the laws of India. Any disputes arising from these terms shall be subject to the jurisdiction of courts in India, in accordance with the Information Technology Act, 2000 and its amendments.</p>

      <h2>12. Contact</h2>
      <p>If you have any questions about these terms, please contact us. We are committed to resolving any concerns promptly and fairly.</p>
    </LegalShell>
  )
}
