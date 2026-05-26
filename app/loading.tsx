export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
      {/* Hero skeleton */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className="skeleton w-48 h-6 mx-auto mb-6 rounded-full" />
        <div className="skeleton w-3/4 h-12 mx-auto mb-3" />
        <div className="skeleton w-1/2 h-12 mx-auto mb-5" />
        <div className="skeleton w-full h-5 mx-auto mb-2" />
        <div className="skeleton w-2/3 h-5 mx-auto mb-8" />
        <div className="flex gap-3 justify-center">
          <div className="skeleton w-40 h-11 rounded-lg" />
          <div className="skeleton w-40 h-11 rounded-lg" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="border border-border rounded-xl bg-surface p-6 lg:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="skeleton w-16 h-8 mx-auto mb-2" />
            <div className="skeleton w-20 h-4 mx-auto" />
          </div>
        ))}
      </div>

      {/* Calculators grid skeleton */}
      <div className="text-center mb-12">
        <div className="skeleton w-32 h-5 mx-auto mb-4 rounded-full" />
        <div className="skeleton w-96 h-9 mx-auto mb-3" />
        <div className="skeleton w-72 h-5 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border border-border rounded-xl bg-surface p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="skeleton w-10 h-10 rounded-lg" />
              <div className="skeleton w-16 h-5 rounded-full" />
            </div>
            <div className="skeleton w-3/4 h-5 mb-2" />
            <div className="skeleton w-full h-4 mb-1" />
            <div className="skeleton w-2/3 h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
