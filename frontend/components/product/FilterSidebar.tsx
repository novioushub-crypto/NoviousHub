'use client'

interface FilterSidebarProps {
  filters: any
  setFilters: (filters: any) => void
}

export default function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  return (
    <div className="card sticky top-24">
      <h3 className="font-bold text-xl mb-6">Filters</h3>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Price Range</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.min_price}
            onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
            className="input text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.max_price}
            onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
            className="input text-sm"
          />
        </div>
      </div>

      {/* Category */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              value=""
              checked={filters.category === ''}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="accent-accent"
            />
            <span>All</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              value="leather-jackets"
              checked={filters.category === 'leather-jackets'}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="accent-accent"
            />
            <span>Leather Jackets</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              value="sportswear"
              checked={filters.category === 'sportswear'}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="accent-accent"
            />
            <span>Sportswear</span>
          </label>
        </div>
      </div>

      <button
        onClick={() => setFilters({ category: '', min_price: '', max_price: '', ordering: '-created_at' })}
        className="w-full btn-outline text-sm"
      >
        Clear Filters
      </button>
    </div>
  )
}
