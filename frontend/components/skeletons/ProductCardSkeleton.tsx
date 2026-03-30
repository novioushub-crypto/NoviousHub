export default function ProductCardSkeleton() {
  return (
    <div className="card animate-pulse">
      {/* Image skeleton */}
      <div className="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
      
      {/* Title skeleton */}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
      
      {/* Price skeleton */}
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
      
      {/* Button skeleton */}
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
