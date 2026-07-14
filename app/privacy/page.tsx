import { LegalShell } from '@/components/legal-shell'

export const metadata = { title: 'Privacy Policy — Groopik' }

export default function Privacy() {
  return (
    <LegalShell
      title="Privacy Policy"
      updated="Last updated: March 2025 · Effective immediately"
      crossLinkHref="/terms"
      crossLinkLabel="Read Terms of Service"
    >
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
      <p>Photos uploaded to Groopik are stored securely using cloud infrastructure. Photos are accessible to all members of the event they were uploaded to. Photos are not shared outside of the event group.</p>
      <p>Event photos may be automatically deleted after 30 days of inactivity. You can delete your photos at any time.</p>

      <h2>4. Cookies and Local Storage</h2>
      <p>Groopik uses browser local storage to save your session token. This allows you to manage your uploads when you return to an event. We do not use advertising cookies or tracking cookies of any kind.</p>

      <h2>5. Third Party Services</h2>
      <p>Groopik uses the following third party services to operate:</p>
      <ul>
        <li><strong>Cloudflare R2</strong> — file storage and delivery</li>
        <li><strong>Vercel</strong> — application hosting and deployment</li>
      </ul>
      <p>These services have their own privacy policies which govern their data handling practices.</p>

      <h2>6. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Delete any photos you have uploaded at any time</li>
        <li>Request deletion of all your data by contacting us</li>
        <li>Know what data we hold about you</li>
      </ul>

      <h2>7. Children&apos;s Privacy</h2>
      <p>Groopik is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately.</p>

      <h2>8. Data Security</h2>
      <p>We take reasonable measures to protect your data including secure HTTPS connections, access controls on our storage, and session-based authentication for photo management. However no system is completely secure and we cannot guarantee absolute security.</p>

      <h2>9. Changes to This Policy</h2>
      <p>We may update this privacy policy from time to time. We will notify users of significant changes. Continued use of Groopik after changes constitutes acceptance of the updated policy.</p>

      <h2>10. Compliance with Indian Law</h2>
      <p>This privacy policy is compliant with the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 of India.</p>

      <h2>11. Contact</h2>
      <p>If you have questions about this privacy policy or want to exercise your rights, please contact us. We will respond within 30 days.</p>
    </LegalShell>
  )
}
