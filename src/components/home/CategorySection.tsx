export default function CategorySection() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <button className="text-blue-600">View All</button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Replace with real category cards */}
        {[1,2,3,4,5].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm text-center">
            Category {i}
          </div>
        ))}
      </div>
    </div>
  );
}