import React, { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import useFetch from '../hooks/useFetch'
import { Search, Check, ChevronDown, X, Sliders } from 'lucide-react'

function Products() {
  useEffect(() => {
    document.title = 'Products';
  }, [])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [priceRange, setPriceRange] = useState(300)
  const [sortBy, setSortBy] = useState('Featured')
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [isBrandCollapsed, setIsBrandCollapsed] = useState(false)

  const sortOptions = [
    { value: 'Featured', label: 'Featured' },
    { value: 'PriceLowToHigh', label: 'Price: Low to High' },
    { value: 'PriceHighToLow', label: 'Price: High to Low' },
    { value: 'TopRated', label: 'Top Rated' }
  ]
  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Featured'

  const categories = ['All', 'Electronics', 'Home & Living', 'Accessories', 'Fitness']
  const brands = ['All', 'SoundWave', 'AuraStyle', 'ApexGear', 'Lumina', 'FitTrack']

  const { data, isLoading, error } = useFetch('/api/product/')

  const getFilteredProducts = () => {
    if (!data || !data.products) return []

    let filtered = [...data.products]

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(p => 
        (p.name && p.name.toLowerCase().includes(term)) || 
        (p.brand && p.brand.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term))
      )
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category && p.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    if (selectedBrand !== 'All') {
      filtered = filtered.filter(p => p.brand && p.brand.toLowerCase() === selectedBrand.toLowerCase())
    }

    filtered = filtered.filter(p => p.price <= priceRange)

    if (sortBy === 'PriceLowToHigh') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'PriceHighToLow') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'TopRated') {
      filtered.sort((a, b) => b.rating - a.rating)
    }

    return filtered
  }

  const filteredProducts = getFilteredProducts()

  return (
    <div className="min-h-screen bg-ochi-charcoal text-white font-sans overflow-x-clip relative">
      
      <div className="relative z-10 max-w-7xl mx-auto py-16 px-8">
        
        {/* --- PAGE HEADER --- */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
          <div className="flex flex-col items-start gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-ochi-green">
              ShopNest Catalog
            </span>
            <h1 className="text-[10vw] md:text-[5vw] font-black uppercase text-white leading-none tracking-tighter select-none">
              ALL PRODUCTS
            </h1>
          </div>
          <p className="font-mono text-xs uppercase tracking-wider text-white/40 max-w-sm">
            Browse our catalog, designed for aesthetic precision, tactile satisfaction, and effortless performance.
          </p>
        </header>

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          
          {/* ================= DESKTOP SIDEBAR FILTERS ================= */}
          <aside className="hidden lg:block lg:w-[260px] lg:shrink-0 bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 sticky top-28 h-fit max-h-[calc(100vh-160px)] overflow-y-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <h2 className="font-mono text-xs uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <Sliders className="h-4 w-4 text-ochi-green" />
                <span>Filters</span>
              </h2>
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                  setSelectedBrand('All')
                  setPriceRange(300)
                }}
                className="font-mono text-[10px] uppercase tracking-wider text-ochi-green hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-8">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-white/45 mb-3">
                Search Product
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-ochi-green transition-all"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-white/45 mb-3">
                Category
              </label>
              <div className="flex flex-col gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`text-left px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all flex items-center justify-between border cursor-pointer ${
                      selectedCategory === category
                        ? 'bg-ochi-green border-ochi-green text-ochi-charcoal font-bold'
                        : 'bg-transparent border-white/10 text-white/70 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span>{category}</span>
                    {selectedCategory === category && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="mb-8 border-b border-white/10 pb-6">
              <button
                onClick={() => setIsBrandCollapsed(!isBrandCollapsed)}
                className="w-full flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-white/45 mb-3 cursor-pointer focus:outline-none select-none hover:text-white/60 transition-colors"
              >
                <span>Brand</span>
                <ChevronDown className={`h-3 w-3 text-white/30 transition-transform duration-300 ${isBrandCollapsed ? '-rotate-90' : ''}`} />
              </button>
              
              <div 
                className={`flex flex-col gap-2 overflow-hidden transition-all duration-300 ${
                  isBrandCollapsed 
                    ? 'max-h-0 opacity-0 pointer-events-none' 
                    : 'max-h-[30vh] opacity-100'
                }`}
              >
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`text-left px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all flex items-center justify-between border cursor-pointer ${
                      selectedBrand === brand
                        ? 'bg-ochi-green border-ochi-green text-ochi-charcoal font-bold'
                        : 'bg-transparent border-white/10 text-white/70 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span>{brand}</span>
                    {selectedBrand === brand && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-[10px] uppercase tracking-wider text-white/45">
                  Max Price
                </label>
                <span className="font-mono text-xs uppercase font-extrabold text-white">${priceRange}</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-ochi-green h-1 bg-[#262626] rounded-full cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[9px] text-white/30 mt-2">
                <span>$10</span>
                <span>$300</span>
              </div>
            </div>
          </aside>

          {/* ================= MAIN CATALOG CONTENT ================= */}
          <main className="w-full min-w-0 flex-1 flex flex-col gap-8">
            
            {/* --- CONTROLS / SORTING BAR --- */}
            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="font-mono text-xs uppercase tracking-wider text-white/50">
                Showing <span className="text-white font-extrabold">{filteredProducts.length}</span> Products
              </div>

              <div className="flex items-center justify-end w-full sm:w-auto gap-4">
                
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden px-4 py-2.5 rounded-full border border-white/20 text-white/80 hover:bg-white hover:text-ochi-charcoal transition-all flex items-center gap-2 font-mono text-xs uppercase tracking-wider cursor-pointer"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Filters</span>
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 relative z-20">
                  <div className="relative">
                    <button
                      onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                      className="bg-transparent border border-white/20 rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-white hover:border-white/35 flex items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <span>Sort: {currentSortLabel}</span>
                      <ChevronDown className={`h-3.5 w-3.5 text-white/40 transition-transform duration-300 ${isSortDropdownOpen ? 'rotate-180 text-ochi-green' : ''}`} />
                    </button>

                    {isSortDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsSortDropdownOpen(false)}></div>
                        
                        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#212121] border border-white/10 shadow-2xl p-1 z-20 flex flex-col overflow-hidden select-none">
                          {sortOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSortBy(option.value)
                                setIsSortDropdownOpen(false)
                              }}
                              className={`w-full text-left px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${
                                sortBy === option.value
                                  ? 'bg-ochi-green text-ochi-charcoal font-bold'
                                  : 'bg-transparent text-white/60 hover:text-white hover:bg-white/[0.03]'
                              }`}
                            >
                              <span>{option.label}</span>
                              {sortBy === option.value && <Check className="h-3.5 w-3.5" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* --- PRODUCTS CARD GRID --- */}
            <div className="w-full">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-ochi-green animate-spin"></div>
                  <span className="text-white/40 font-mono text-xs uppercase tracking-wider">Loading items...</span>
                </div>
              ) : error ? (
                <div className="text-center py-16 border border-rose-500/10 rounded-2xl bg-rose-500/5 p-8">
                  <h3 className="text-rose-400 font-extrabold text-sm uppercase mb-1">Error fetching catalog</h3>
                  <p className="text-rose-400/60 font-mono text-xs uppercase">{error.message || error}</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/[0.01] p-8">
                  <h3 className="text-white/60 font-bold font-mono text-sm uppercase mb-2">No items found</h3>
                  <p className="text-white/35 font-mono text-xs max-w-xs mx-auto leading-relaxed">We couldn't find any products matching your search criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  <ProductCard products={filteredProducts} />
                </div>
              )}
            </div>

          </main>
        </div>

      </div>

      {/* ================= MOBILE FILTERS DRAWER (Overlay Modal) ================= */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileFiltersOpen(false)}></div>

          <div className="relative w-[85vw] max-w-sm h-full bg-[#212121] border-l border-white/10 p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-ochi-green" />
                  <span>Filters</span>
                </h3>
                <button 
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 rounded-full border border-white/10 text-white/50 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="mb-6">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-white/45 mb-3">
                  Search Product
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-ochi-green"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                </div>
              </div>

              {/* Mobile Categories */}
              <div className="mb-6">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-white/45 mb-3">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full border font-mono text-[10px] uppercase tracking-wider transition-all ${
                        selectedCategory === category
                          ? 'bg-ochi-green border-ochi-green text-ochi-charcoal font-bold'
                          : 'bg-transparent border-white/10 text-white/70 hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Brands */}
              <div className="mb-6 border-b border-white/10 pb-6">
                <button
                  onClick={() => setIsBrandCollapsed(!isBrandCollapsed)}
                  className="w-full flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-white/45 mb-3 cursor-pointer focus:outline-none select-none hover:text-white/60 transition-colors"
                >
                  <span>Brand</span>
                  <ChevronDown className={`h-3 w-3 text-white/30 transition-transform duration-300 ${isBrandCollapsed ? '-rotate-90' : ''}`} />
                </button>
                
                <div 
                  className={`flex flex-wrap gap-2 overflow-hidden transition-all duration-300 ${
                    isBrandCollapsed 
                      ? 'max-h-0 opacity-0 pointer-events-none' 
                      : 'max-h-[30vh] opacity-100'
                  }`}
                >
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-4 py-2 rounded-full border font-mono text-[10px] uppercase tracking-wider transition-all ${
                        selectedBrand === brand
                          ? 'bg-ochi-green border-ochi-green text-ochi-charcoal font-bold'
                          : 'bg-transparent border-white/10 text-white/70 hover:text-white'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-white/45">
                    Max Price
                  </label>
                  <span className="font-mono text-xs uppercase font-extrabold text-white">${priceRange}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-ochi-green h-1 bg-[#262626] rounded-full"
                />
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                  setSelectedBrand('All')
                  setPriceRange(300)
                }}
                className="flex-1 py-3 rounded-full border border-white/10 text-white font-mono text-xs uppercase tracking-wider cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 py-3 rounded-full bg-ochi-green text-ochi-charcoal font-mono text-xs uppercase tracking-wider font-bold cursor-pointer"
              >
                Apply
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default Products
