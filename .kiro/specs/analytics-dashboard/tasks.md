# Implementation Plan: Analytics Dashboard

## Overview

Implement the analytics dashboard as a new `/analytics` route in the existing Next.js 14 App Router project. The work proceeds in layers: types and service → data hook → UI components → page wiring → export utility → final integration.

## Tasks

- [ ] 1. Define shared types and add Recharts dependency
  - Create `src/types/analytics.ts` with `TimeRange`, `ExportFormat`, `GrowthDataPoint`, `VolumeDataPoint`, `TopCreator`, `StatsSummary`, and `AnalyticsMetrics` types
  - Add `recharts` and `@types/recharts` to `package.json` dependencies
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 4.1, 5.1, 6.2_

- [ ] 2. Implement `analyticsApi` service
  - [ ] 2.1 Create `src/services/analyticsApi.ts` with `getMetrics(timeRange: TimeRange): Promise<AnalyticsMetrics>` using the shared `request()` helper from `src/services/api.ts`
    - Call `GET /analytics?timeRange={timeRange}`
    - _Requirements: 1.6, 2.2, 7.1_

  - [ ]* 2.2 Write unit tests for `analyticsApi`
    - Test successful fetch returns typed `AnalyticsMetrics`
    - Test that API errors propagate as `Error` instances
    - _Requirements: 1.6_

- [ ] 3. Implement `useAnalytics` hook
  - [ ] 3.1 Create `src/hooks/useAnalytics.ts` returning `{ metrics, loading, error, lastFetchedAt, refetch }`
    - Default `timeRange` to `"30d"` on mount
    - Re-fetch when `timeRange` argument changes
    - Preserve previously loaded `metrics` on error (do not clear on re-fetch failure)
    - Set `lastFetchedAt` to `new Date()` on each successful response
    - _Requirements: 1.5, 1.6, 2.2, 2.3, 2.4, 7.2, 7.3, 7.4_

  - [ ]* 3.2 Write property test for `useAnalytics` — Property 1: error preservation
    - **Property 1: Previously loaded metrics are never cleared on a subsequent fetch error**
    - **Validates: Requirements 1.6**

  - [ ]* 3.3 Write property test for `useAnalytics` — Property 2: loading state consistency
    - **Property 2: `loading` is true for the entire duration of any fetch and false otherwise**
    - **Validates: Requirements 2.4, 7.4**

- [ ] 4. Implement `StatCard` component
  - [ ] 4.1 Create `src/components/analytics/StatCard.tsx`
    - Render `label`, formatted `value`, and optional `trend` badge (green up-arrow / red down-arrow)
    - Render skeleton placeholder when `loading` is true
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 4.2 Write unit tests for `StatCard`
    - Test skeleton renders when `loading=true`
    - Test positive trend shows green badge, negative shows red badge
    - _Requirements: 1.5_

- [ ] 5. Implement `TimeRangeSelector` component
  - [ ] 5.1 Create `src/components/analytics/TimeRangeSelector.tsx`
    - Render four buttons: 7d / 30d / 90d / 1y
    - Highlight the active `value`; disable all buttons when `disabled` is true
    - _Requirements: 2.1, 2.3, 2.4_

  - [ ]* 5.2 Write unit tests for `TimeRangeSelector`
    - Test all four options render
    - Test buttons are disabled when `disabled=true`
    - Test `onChange` fires with correct value on click
    - _Requirements: 2.1, 2.4_

- [ ] 6. Implement chart components
  - [ ] 6.1 Create `src/components/analytics/UserGrowthChart.tsx` using Recharts `LineChart`
    - Show skeleton/spinner when `loading=true`
    - Show empty-state message when `empty=true`
    - Enable `<Tooltip>` showing date and cumulative count on hover
    - _Requirements: 3.1, 3.4, 3.5_

  - [ ]* 6.2 Write unit tests for `UserGrowthChart`
    - Test empty-state renders when `empty=true`
    - Test loading state renders when `loading=true`
    - _Requirements: 3.5_

  - [ ] 6.3 Create `src/components/analytics/TipVolumeChart.tsx` using Recharts `BarChart`
    - Display `trend` percentage label above the chart
    - Show skeleton/spinner when `loading=true`
    - Show empty-state message when `empty=true`
    - Enable `<Tooltip>` showing interval label and XLM volume on hover
    - _Requirements: 4.1, 4.3, 4.4, 4.5_

  - [ ]* 6.4 Write unit tests for `TipVolumeChart`
    - Test trend percentage renders correctly for positive and negative values
    - Test empty-state renders when `empty=true`
    - _Requirements: 4.4, 4.5_

- [ ] 7. Implement `TopCreatorsLeaderboard` component
  - [ ] 7.1 Create `src/components/analytics/TopCreatorsLeaderboard.tsx`
    - Render ranked rows with rank, username, tip count, and total XLM
    - Each row is a Next.js `<Link href="/creator/[username]">`
    - Show skeleton rows when `loading=true`
    - Render only available entries when fewer than 10 exist
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 7.2 Write unit tests for `TopCreatorsLeaderboard`
    - Test each row links to the correct creator profile URL
    - Test partial list renders without errors
    - _Requirements: 5.3, 5.4_

- [ ] 8. Implement `exportService` and `ExportButton`
  - [ ] 8.1 Create `src/utils/exportService.ts` with `download(metrics, timeRange, format)` — pure client-side, no network calls
    - CSV: serialize `summary`, `growthData`, `volumeData`, `topCreators` sections
    - JSON: `JSON.stringify` the full `AnalyticsMetrics` object
    - Filename pattern: `analytics-{timeRange}-{YYYY-MM-DD}.{format}`
    - Trigger download via a temporary `<a>` element with `Blob` URL
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 8.2 Write property test for `exportService` — Property 3: filename determinism
    - **Property 3: For any valid `(timeRange, date)` pair the filename always matches `analytics-{timeRange}-{YYYY-MM-DD}.{format}`**
    - **Validates: Requirements 6.4**

  - [ ]* 8.3 Write property test for `exportService` — Property 4: JSON round-trip
    - **Property 4: JSON export parsed back to an object equals the original `AnalyticsMetrics` value**
    - **Validates: Requirements 6.3**

  - [ ] 8.4 Create `src/components/analytics/ExportButton.tsx`
    - Dropdown with CSV and JSON options
    - Disabled when `disabled=true` (loading in progress)
    - Calls `exportService.download()` on selection
    - _Requirements: 6.1, 6.2, 6.5_

  - [ ]* 8.5 Write unit tests for `ExportButton`
    - Test button is disabled when `disabled=true`
    - Test `exportService.download` is called with correct format on selection
    - _Requirements: 6.5_

- [ ] 9. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement `RefreshButton` component
  - [ ] 10.1 Create `src/components/analytics/RefreshButton.tsx`
    - Icon button that calls `onRefresh`
    - Shows spinner icon while `loading=true`
    - Displays `lastFetchedAt` timestamp next to the button (e.g. "Last updated 2 min ago")
    - _Requirements: 7.2, 7.3, 7.4_

  - [ ]* 10.2 Write unit tests for `RefreshButton`
    - Test spinner renders when `loading=true`
    - Test `onRefresh` is called on click
    - _Requirements: 7.3, 7.4_

- [ ] 11. Assemble `AnalyticsDashboard` client component
  - [ ] 11.1 Create `src/components/analytics/AnalyticsDashboard.tsx`
    - Own `timeRange` state (default `"30d"`)
    - Call `useAnalytics(timeRange)` and distribute `metrics`, `loading`, `error`, `lastFetchedAt`, `refetch` to child components
    - Render inline error banner when `error` is set; keep previously loaded data visible
    - Render `TimeRangeSelector`, four `StatCard`s, `UserGrowthChart`, `TipVolumeChart`, `TopCreatorsLeaderboard`, `ExportButton`, and `RefreshButton`
    - Derive `empty` flags from `metrics?.growthData.length === 0` and `metrics?.volumeData.length === 0`
    - _Requirements: 1.1–1.6, 2.1–2.4, 3.1–3.5, 4.1–4.5, 5.1–5.4, 6.1–6.5, 7.2–7.4_

  - [ ]* 11.2 Write integration tests for `AnalyticsDashboard`
    - Mock `analyticsApi.getMetrics` to return fixture data; assert all stat cards render
    - Mock API error; assert error banner appears and previous data remains visible
    - _Requirements: 1.5, 1.6, 2.4_

- [ ] 12. Create `/analytics` page route
  - Create `src/app/analytics/page.tsx` as a React Server Component that renders `<AnalyticsDashboard />`
  - Add `"use client"` directive only to `AnalyticsDashboard`, not the page shell
  - _Requirements: 1.1, 2.1_

- [ ] 13. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Recharts renders nothing on the server and hydrates on the client — no SSR issues
- `exportService` must only run in the browser; guard with `typeof window !== "undefined"` if imported in shared modules
- Property tests validate universal correctness properties; unit tests validate specific examples and edge cases
