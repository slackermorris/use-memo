import { useState, useCallback, memo, useMemo } from "react";
import { Button } from "../Button";

// Properly memoized component
const LibraryCheckout = memo(function LibraryCheckout({
  books,
  reserveBook,
}: {
  books: string[];
  reserveBook: () => void;
}) {
  console.log("✅ LibraryCheckout rendered (memoized)");

  return (
    <div className="p-4 border border-green-200 rounded-lg bg-green-50">
      <h4 className="font-semibold text-green-800 mb-2">
        Library Checkout (Properly Memoized)
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

// Memoized parent component
const Library = memo(function Library({ books }: { books: string[] }) {
  console.log("✅ Library rendered (memoized)");

  // ✅ useCallback with stable dependency
  const reserveBook = useCallback(() => {
    console.log("Reserving a book from:", books);
  }, [books]);

  return (
    <div className="space-y-4">
      <div className="p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold mb-2">
          Library (Memoized Parent Component)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          This component demonstrates effective memoization:
        </p>
        <ul className="text-sm text-gray-600 space-y-1 mb-4">
          <li>✅ Child component is memoized</li>
          <li>✅ The 'books' prop is referentially stable (useMemo)</li>
          <li>✅ This parent component is also memoized</li>
          <li>✅ useCallback dependency is stable</li>
        </ul>
      </div>

      <LibraryCheckout books={books} reserveBook={reserveBook} />
    </div>
  );
});

export function EffectiveMemoExample() {
  const [counter, setCounter] = useState(0);
  const [bookCount, setBookCount] = useState(3);

  // ✅ This creates a stable reference using useMemo
  const books = useMemo(
    () => Array.from({ length: bookCount }, (_, i) => `Book ${i + 1}`),
    [bookCount]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Effective Memoization</h3>
          <p className="text-sm text-gray-600">
            Counter: {counter} | Books: {bookCount}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCounter((c) => c + 1)} size="sm">
            Increment Counter
          </Button>
          <Button
            onClick={() => setBookCount((c) => c + 1)}
            size="sm"
            variant="secondary"
          >
            Add Book
          </Button>
        </div>
      </div>

      <div className="p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-gray-700 mb-4">
          <strong>Open your browser console</strong> to see the render logs.
          Notice how the Library component only re-renders when books change,
          not when counter changes!
        </p>
        <p className="text-sm text-gray-600">
          The <code>books</code> array is memoized with useMemo, creating a
          stable reference. All components in the chain are memoized, making the
          optimization effective.
        </p>
      </div>

      <Library books={books} />
    </div>
  );
}
