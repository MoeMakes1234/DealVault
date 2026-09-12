import PageShell from '@/components/PageShell'

export const metadata = { title: 'Privacy Policy — DealVault' }

export default function PrivacyPage() {
  return (
    <PageShell title="Privacy Policy">
      <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <p>
        This is a placeholder Privacy Policy for DealVault. Before launching to real customers, replace this with a
        policy reviewed for your jurisdiction — you can generate a proper one for free at services like Termly or
        iubenda, or have it reviewed by counsel.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Information We Collect</h2>
      <p>
        We collect information you provide directly, such as your name, email, company name, and the deal, budget, and
        contractor data you enter into the platform. We also collect basic usage data to improve the product.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">How We Use Your Information</h2>
      <p>
        We use your information to provide and improve the DealVault service, communicate with you about your account,
        and ensure the security of the platform. We do not sell your personal information.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Data Security</h2>
      <p>
        We use industry-standard measures to protect your data in transit and at rest. No method of transmission over
        the internet is completely secure, but we work to protect your information using commercially reasonable means.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Your Rights</h2>
      <p>
        You may access, update, or delete your account data at any time from your dashboard, or by contacting us. You
        own your data and can export it whenever you like.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Contact</h2>
      <p>Questions about this policy? Reach us through the Contact page.</p>
    </PageShell>
  )
}
