import { useState } from "react";
import { Card } from "./components/Card";
import { Button } from "./components/Button";
import { BrokenMemoExample } from "./components/examples/BrokenMemoExample";
import { ComponentCompositionExample } from "./components/examples/ComponentCompositionExample";
import { LatestRefExample } from "./components/examples/LatestRefExample";
import { ChildrenBreakMemoExample } from "./components/examples/ChildrenBreakMemoExample";

function App() {
  const [activeExample, setActiveExample] = useState<string>("broken");

  const examples = [
    { id: "broken", title: "Broken Memoization", component: BrokenMemoExample },

    {
      id: "composition",
      title: "Component Composition",
      disabled: true,
      component: ComponentCompositionExample,
    },
    {
      id: "latest-ref",
      title: "Latest Ref Pattern",
      disabled: true,
      component: LatestRefExample,
    },
    {
      id: "children",
      title: "Children Break Memo",
      disabled: true,
      component: ChildrenBreakMemoExample,
    },
  ];

  const ActiveComponent =
    examples.find((ex) => ex.id === activeExample)?.component ||
    BrokenMemoExample;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Memoisation in React
            </h1>
            <p className="text-lg text-gray-600">
              Demonstrating when memoisation helps, when it hurts, and the
              "all-or-nothing" principle
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {examples.map((example) => (
              <Button
                key={example.id}
                variant={
                  activeExample === example.id
                    ? "primary"
                    : example.disabled
                    ? "disabled"
                    : "secondary"
                }
                onClick={() => setActiveExample(example.id)}
                size="sm"
                disabled={example.disabled}
              >
                {example.title}
              </Button>
            ))}
          </div>

          <Card
            title={
              examples.find((ex) => ex.id === activeExample)?.title || "Example"
            }
          >
            <ActiveComponent />
          </Card>

          <div className="text-center">
            <a
              href="https://github.com/slackermorris/use-memo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <span>View Source on GitHub</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
