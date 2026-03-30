export default function OrderCardSkeleton() {
  return (
    <div className="card animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        </div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
      </div>
      
      {/* Items */}
      <div className="space-y-3 mb-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Button */}
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}

export function OrderListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  )
}
