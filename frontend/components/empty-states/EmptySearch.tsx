import { SearchX } from 'lucide-react'

interface EmptySearchProps {
  query?: string
}

export default function EmptySearch({ query }: EmptySearchProps) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <SearchX className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-3xl font-bold mb-3">No results found</h2>
      <p className="text-text-secondary mb-8 max-w-md mx-auto">
        {query ? (
          <>We couldn't find any products matching "<span className="font-semibold">{query}</span>"</>
        ) : (
          <>We couldn't find any products matching your search</>
        )}
      </p>
      <div className="space-y-2 text-sm text-text-secondary">
        <p>Try:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Checking your spelling</li>
          <li>Using more general terms</li>
          <li>Using fewer keywords</li>
        </ul>
      </div>
    </div>
  )
}
