// Server component so it can export generateStaticParams, which
// `output: 'export'` requires for every dynamic route. Slugs are the keys of
// the `docs` record in BilgiClient — kept in sync by hand; there are seven and
// they are static content, not data.
import BilgiClient from './BilgiClient'

const SLUGS = [
  'hakkinda',
  'sartlar',
  'sorumlu-oyun',
  'hesap-dogrulama',
  'gizlilik',
  'vip',
  'bonuslar',
]

export function generateStaticParams() {
  return SLUGS.map(slug => ({ slug }))
}

export default function BilgiPage() {
  return <BilgiClient />
}
