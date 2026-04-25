"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchFilters, type SearchFilterState } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";
import { useDebounce } from "@/hooks/useDebounce";
import { CREATOR_EXAMPLES, type Creator } from "@/utils/creatorData";

const HISTORY_KEY = "stellar_search_history_page";
const DEFAULT_FILTERS: SearchFilterState = { categories: [], verifiedOnly: false, sort: "popular" };

function trackSearch(query: string) {
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/search", JSON.stringify({ query, ts: Date.now() }));
  }
}

function applyFilters(creators: Creator[], query: string, filters: SearchFilterState): Creator[] {
  let result = [...creators];

  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (c) =>
        c.username.toLowerCase().includes(q) ||
        c.displayName?.toLowerCase().includes(q) ||
        c.bio?.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)) ||
        c.categories.some((cat) => cat.toLowerCase().includes(q))
    );
  }

  if (filters.categories.length > 0) {
    result = result.filter((c) => filters.categories.some((cat) => c.categories.includes(cat)));
  }

  if (filters.verifiedOnly) {
    result = result.filter((c) => c.verified);
  }

  switch (filters.sort) {
    case "popular":
      result.sort((a, b) => (b.followers ?? 0) - (a.followers ?? 0));
      break;
    case "recent":
      result.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
      break;
    case "earnings":
      result.sort((a, b) => b.earnings - a.earnings);
      break;
  }

  return result;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilterState>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const debouncedQuery = useDebounce(query, 300);

  // Load history
  useEffect(() => {
    try {
      setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]"));
    } catch {}
  }, []);

  // Analytics + history on debounced query change
  useEffect(() => {
    if (!debouncedQuery.trim()) return;
    trackSearch(debouncedQuery);
    setHistory((prev) => {
      const next = [debouncedQuery, ...prev.filter((h) => h !== debouncedQuery)].slice(0, 10);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, [debouncedQuery]);

  // Simulate loading state on query/filter change
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(t);
  }, [debouncedQuery, filters]);

  const results = useMemo(
    () => applyFilters(CREATOR_EXAMPLES, debouncedQuery, filters),
    [debouncedQuery, filters]
  );

  const activeFilterCount = filters.categories.length + (filters.verifiedOnly ? 1 : 0);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Search Creators</h1>
        <p className="mt-1 text-ink/60">Find creators by name, category, or tag.</p>
      </div>

      {/* Search bar + filter toggle */}
      <div className="flex gap-3">
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className={`relative inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
            showFilters || activeFilterCount > 0
              ? "border-wave bg-wave/10 text-wave"
              : "border-ink/20 text-ink/70 hover:bg-ink/5"
          }`}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-wave text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Recent searches */}
      {!query && history.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink/40">Recent:</span>
          {history.slice(0, 5).map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setQuery(h)}
              className="inline-flex items-center gap-1 rounded-full border border-ink/10 bg-ink/5 px-3 py-1 text-xs text-ink/70 hover:border-wave/40 hover:text-ink transition-colors"
            >
              {h}
              <X
                className="h-3 w-3 opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setHistory((prev) => {
                    const next = prev.filter((s) => s !== h);
                    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
                    return next;
                  });
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Main layout */}
      <div className="flex gap-6">
        {/* Filter sidebar */}
        {showFilters && (
          <div className="w-56 shrink-0">
            <SearchFilters filters={filters} onChange={setFilters} resultCount={results.length} />
          </div>
        )}

        {/* Results */}
        <div className="min-w-0 flex-1">
          <SearchResults results={results} isLoading={isLoading} query={debouncedQuery} />
        </div>
      </div>
    </section>
  );
}
