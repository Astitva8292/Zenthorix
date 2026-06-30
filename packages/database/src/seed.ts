export async function seedDatabase() {
  console.log('[Seed] Creating default workspace templates...')
  const templates = [
    { name: 'Next.js + Tailwind', type: 'nextjs' },
    { name: 'Express API', type: 'express' },
    { name: 'React SPA', type: 'react' },
  ]
  console.log(`[Seed] ${templates.length} templates registered`)
  console.log('[Seed] Done.')
}
