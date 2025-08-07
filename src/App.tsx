import { Github } from 'lucide-react';
import { Button } from './components/Button';
import { Card } from './components/Card';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Modern React Template
            </h1>
            <p className="text-lg text-gray-600">
              A production-ready template with React, TypeScript, Tailwind CSS, and Vitest
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Features">
              <ul className="space-y-2 text-gray-600">
                <li>✓ React 18 with TypeScript</li>
                <li>✓ Vite for fast development</li>
                <li>✓ Tailwind CSS for styling</li>
                <li>✓ Vitest for testing</li>
                <li>✓ ESLint configuration</li>
                <li>✓ Pre-built components</li>
              </ul>
            </Card>

            <Card title="Getting Started">
              <div className="space-y-4">
                <p className="text-gray-600">
                  Edit <code className="text-sm font-mono bg-gray-100 px-1 py-0.5 rounded">src/App.tsx</code> and save to test HMR updates.
                </p>
                <div className="flex space-x-4">
                  <Button>
                    Primary Button
                  </Button>
                  <Button variant="secondary">
                    Secondary
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex justify-center">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Github className="w-5 h-5" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;