import { useState, useCallback, memo } from "react";
import { Button } from "../Button";

// This component looks like it's memoized, but it's not working effectively
function LibraryCheckout({
  books,
  reserveBook,
}: {
  books: string[];
  reserveBook: () => void;
}) {
  console.log("🔴 LibraryCheckout rendered");

  return (
    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
      <h4 className="font-semibold text-red-800 mb-2">
        Library Checkout (Not Memoized)
      </h4>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Available books: {books.length}</p>
        <Button onClick={reserveBook} size="sm">
          Reserve Book
        </Button>
      </div>
    </div>
  );
}

// This component is memoized, but still re-renders due to broken memoization chain
const MemoizedLibraryCheckout = memo(function MemoizedLibraryCheckout({
  books,
  reserveBook,
}: {
  books: string[];
  reserveBook: () => void;
}) {
  console.log("🟡 MemoizedLibraryCheckout rendered");

  return (
    <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
      <h4 className="font-semibold text-yellow-800 mb-2">
        Library Checkout (Memoized)
      </h4>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Available books: {books.length}</p>
        <Button onClick={reserveBook} size="sm">
          Reserve Book
        </Button>
      </div>
    </div>
  );
});

function Library({ books }: { books: string[] }) {
  console.log("🔴 Library rendered");

  // ❌ Problem 1: We're memoizing the callback, but the component isn't memoized
  // ❌ Problem 2: The 'books' dependency might not be referentially stable
  const reserveBook = useCallback(() => {
    console.log("Reserving a book from:", books);
  }, [books]);

  return (
    <div className="space-y-4">
      <div className="p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold mb-2">Library (Parent Component)</h3>
        <p className="text-sm text-gray-600 mb-4">
          This component tries to use useCallback, but memoization is broken
          because:
        </p>
        <ul className="text-sm text-gray-600 space-y-1 mb-4">
          <li>1. ❌ Child component isn't memoized (first example)</li>
          <li>
            2. ❌ The 'books' prop isn't referentially stable (both examples)
          </li>
          <li>3. ❌ This parent component isn't memoized either</li>
        </ul>
      </div>

      <LibraryCheckout books={books} reserveBook={reserveBook} />
      <MemoizedLibraryCheckout books={books} reserveBook={reserveBook} />
    </div>
  );
}

export function BrokenMemoExample() {
  const [counter, setCounter] = useState(0);

  // ❌ This creates a new array reference on every render
  // Breaking the memoization chain completely
  const books = ["Book 1", "Book 2", "Book 3"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Broken Memoization</h3>
          <p className="text-sm text-gray-600">
            Counter: {counter} (Click to trigger re-renders)
          </p>
        </div>
        <Button onClick={() => setCounter((c) => c + 1)}>
          Increment Counter
        </Button>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700 mb-4">
          <strong>Open your browser console</strong> to see the render logs.
          Notice how all components re-render on every state change, despite our
          memoization attempts.
        </p>
        <p className="text-sm text-gray-600">
          The <code>books</code> array is recreated on every render, breaking
          the useCallback dependency. Even the memoized component re-renders
          because its props change.
        </p>
      </div>

      <Library books={books} />
    </div>
  );
}
