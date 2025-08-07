interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="px-6 py-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        {children}
      </div>
    </div>
  );
}