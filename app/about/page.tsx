import PageShell from '@/components/PageShell'

export const metadata = { title: 'About — DealVault' }

export default function AboutPage() {
  return (
    <PageShell title="About DealVault">
      <p className="text-lg text-gray-700">
        DealVault is the all-in-one platform built for real estate developers and house flippers who have outgrown
        spreadsheets but don't need bloated enterprise construction software.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Why we built it</h2>
      <p>
        Most flippers and small developers run their entire business out of a patchwork of spreadsheets, text messages,
        and shoeboxes full of receipts. As soon as you're juggling more than one or two projects, budgets slip,
        contractors fall through the cracks, and it becomes impossible to know your real profit until the deal closes.
      </p>
      <p>
        DealVault brings deal pipeline, budgets, contractors, documents, and timelines into one place — so you always
        know exactly where every project stands and what it's really going to make you.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Who it's for</h2>
      <p>
        Whether you're doing your first flip or running a small development team on 20+ projects a year, DealVault
        scales with you. It's designed to be simple enough to start using in minutes, but detailed enough to run your
        whole operation.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">The mission</h2>
      <p>
        To give independent real estate operators the same caliber of tools the big firms have — at a price that makes
        sense for a growing business.
      </p>
    </PageShell>
  )
}
