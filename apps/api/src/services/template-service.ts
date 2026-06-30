const TEMPLATES: Record<string, Record<string, string>> = {
  'nextjs-tailwind': {
    'package.json': JSON.stringify({ name: 'my-app', scripts: { dev: 'next dev', build: 'next build' }, dependencies: { next: '^15.0.0', react: '^19.0.0' } }, null, 2),
    'pages/index.tsx': 'export default function Home() { return <div>Hello</div> }',
    'tailwind.config.ts': 'export default { content: ["./pages/**/*.tsx"] }',
  },
  'express-api': {
    'package.json': JSON.stringify({ name: 'my-api', scripts: { start: 'node index.js' }, dependencies: { express: '^4.18.0' } }, null, 2),
    'index.js': "const express = require('express'); const app = express(); app.listen(3000)",
  },
}

export class TemplateService {
  getTemplates(): string[] { return Object.keys(TEMPLATES) }
  getTemplate(name: string): Record<string, string> | undefined { return TEMPLATES[name] }
  scaffold(name: string): Record<string, string> { return { ...TEMPLATES[name] } ?? {} }
}
