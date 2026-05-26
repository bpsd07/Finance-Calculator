export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <div className="skeleton w-64 h-8 mb-2" />
      <div className="skeleton w-96 h-5 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="border border-border rounded-xl bg-surface p-6">
            <div className="skeleton w-48 h-5 mb-6" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mb-5">
                <div className="skeleton w-32 h-4 mb-2" />
                <div className="skeleton w-full h-10 rounded-lg mb-2" />
              </div>
            ))}
          </div>
          <div className="border border-border rounded-xl bg-surface p-6">
            <div className="skeleton w-40 h-5 mb-6" />
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <div className="skeleton w-28 h-4" />
                    <div className="skeleton w-20 h-4" />
                  </div>
                  <div className="skeleton w-full h-1.5 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-border rounded-xl bg-surface p-6 sticky top-20">
          <div className="text-center mb-4">
            <div className="skeleton w-24 h-4 mx-auto mb-2" />
            <div className="skeleton w-40 h-10 mx-auto mb-4" />
          </div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex justify-between mb-3">
              <div className="skeleton w-20 h-4" />
              <div className="skeleton w-24 h-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
