import PageShell from '@/components/PageShell'

export const metadata = { title: 'Terms of Service — DealVault' }

export default function TermsPage() {
  return (
    <PageShell title="Terms of Service">
      <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <p>
        This is a placeholder Terms of Service for DealVault. Before charging customers, replace this with terms
        reviewed for your jurisdiction — you can generate a starting point for free at services like Termly or have it
        reviewed by counsel.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Acceptance of Terms</h2>
      <p>
        By accessing or using DealVault, you agree to be bound by these terms. If you do not agree, please do not use
        the service.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Use of the Service</h2>
      <p>
        DealVault provides project management, budgeting, and tracking tools for real estate professionals. You are
        responsible for the accuracy of the data you enter and for maintaining the confidentiality of your account
        credentials.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Subscriptions & Billing</h2>
      <p>
        Paid plans are billed on a recurring basis. You may cancel at any time; cancellation takes effect at the end of
        the current billing period. Free trials convert to paid plans only if you choose to continue.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Disclaimer</h2>
      <p>
        DealVault is provided "as is" without warranties of any kind. It is a tool to help you organize your business
        and does not constitute financial, legal, or tax advice. Always consult a qualified professional for such
        matters.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, DealVault shall not be liable for any indirect, incidental, or
        consequential damages arising from your use of the service.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Contact</h2>
      <p>Questions about these terms? Reach us through the Contact page.</p>
    </PageShell>
  )
}
