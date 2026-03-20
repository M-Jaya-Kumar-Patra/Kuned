export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto p-6 animate-pulse">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="h-80 bg-gray-200 rounded-lg" />
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 w-1/2 rounded" />
          <div className="h-10 bg-gray-200 w-3/4 rounded" />
          <div className="h-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}