# Requirements Document

## Introduction

The Analytics Dashboard provides platform-wide statistics and visualizations for the Stellar Tip Jar platform. It surfaces key metrics including user growth, tip volume, transaction trends, and creator activity through interactive charts. Administrators and platform stakeholders can view aggregated data over configurable time ranges and export reports for offline analysis.

## Glossary

- **Dashboard**: The analytics page at `/analytics` that renders all platform statistics and charts.
- **Analytics_API**: The backend service endpoint that aggregates and returns platform metrics data.
- **Chart**: An interactive SVG-based visualization rendered in the browser using a charting library.
- **Metric**: A single quantitative measurement (e.g., total tips sent, active users).
- **Time_Range**: A user-selected period (7 days, 30 days, 90 days, 1 year) used to filter metric data.
- **Report**: A downloadable file (CSV or JSON) containing the currently displayed metric data.
- **Stat_Card**: A UI component displaying a single Metric with its current value and period-over-period change.
- **Trend**: The directional change of a Metric over a Time_Range, expressed as a percentage.
- **Export_Service**: The client-side module responsible for generating and triggering Report downloads.
- **Creator**: A registered platform user with a public profile who receives tips.

---

## Requirements

### Requirement 1: Platform Statistics Overview

**User Story:** As a platform stakeholder, I want to see high-level platform statistics at a glance, so that I can quickly assess overall platform health.

#### Acceptance Criteria

1. THE Dashboard SHALL display a Stat_Card for total tips sent (count).
2. THE Dashboard SHALL display a Stat_Card for total tip volume (XLM amount).
3. THE Dashboard SHALL display a Stat_Card for total registered Creators.
4. THE Dashboard SHALL display a Stat_Card for active Creators within the selected Time_Range.
5. WHEN metric data is loading, THE Dashboard SHALL display a skeleton loading state for each Stat_Card.
6. IF the Analytics_API returns an error, THEN THE Dashboard SHALL display an error message and a retry action without hiding previously loaded data.

---

### Requirement 2: Time Range Selection

**User Story:** As a platform stakeholder, I want to filter all metrics by a time range, so that I can analyze trends over different periods.

#### Acceptance Criteria

1. THE Dashboard SHALL provide Time_Range options of 7 days, 30 days, 90 days, and 1 year.
2. WHEN a Time_Range is selected, THE Dashboard SHALL re-fetch all metric data for that period.
3. THE Dashboard SHALL default to the 30-day Time_Range on initial load.
4. WHILE a Time_Range change is in progress, THE Dashboard SHALL display a loading indicator and disable further Time_Range selection.

---

### Requirement 3: User Growth Chart

**User Story:** As a platform stakeholder, I want to see a chart of user growth over time, so that I can understand platform adoption trends.

#### Acceptance Criteria

1. THE Dashboard SHALL render a line Chart showing cumulative Creator registrations over the selected Time_Range.
2. THE Chart SHALL display data points at daily intervals for Time_Range values of 7 days and 30 days.
3. THE Chart SHALL display data points at weekly intervals for Time_Range values of 90 days and 1 year.
4. WHEN a data point is hovered, THE Chart SHALL display a tooltip showing the date and cumulative Creator count.
5. IF no registration data exists for the selected Time_Range, THEN THE Chart SHALL display an empty-state message.

---

### Requirement 4: Tip Volume Chart

**User Story:** As a platform stakeholder, I want to see a chart of tip volume over time, so that I can track transaction activity and revenue trends.

#### Acceptance Criteria

1. THE Dashboard SHALL render a bar Chart showing total tip volume (XLM) aggregated per interval over the selected Time_Range.
2. THE Chart SHALL use the same interval rules as Requirement 3 (daily for ≤30 days, weekly for ≥90 days).
3. WHEN a bar is hovered, THE Chart SHALL display a tooltip showing the interval label and total XLM volume.
4. THE Chart SHALL display the Trend percentage for the selected Time_Range compared to the equivalent prior period.
5. IF no tip data exists for the selected Time_Range, THEN THE Chart SHALL display an empty-state message.

---

### Requirement 5: Top Creators Leaderboard

**User Story:** As a platform stakeholder, I want to see which creators are receiving the most tips, so that I can identify top performers on the platform.

#### Acceptance Criteria

1. THE Dashboard SHALL display a ranked list of the top 10 Creators by tip volume within the selected Time_Range.
2. THE Dashboard SHALL show each Creator's rank, username, tip count, and total XLM received.
3. WHEN a Creator entry is clicked, THE Dashboard SHALL navigate to that Creator's profile page.
4. IF fewer than 10 Creators have received tips in the selected Time_Range, THE Dashboard SHALL display only the available entries.

---

### Requirement 6: Report Export

**User Story:** As a platform stakeholder, I want to export the current dashboard data as a report, so that I can analyze it offline or share it with others.

#### Acceptance Criteria

1. THE Dashboard SHALL provide an export action that triggers a Report download.
2. THE Export_Service SHALL support CSV and JSON as Report formats.
3. WHEN an export format is selected, THE Export_Service SHALL generate a Report containing all currently displayed metric data for the active Time_Range.
4. THE Export_Service SHALL name the downloaded file using the pattern `analytics-{time_range}-{YYYY-MM-DD}.{format}`.
5. IF the metric data has not finished loading, THEN THE Dashboard SHALL disable the export action until loading is complete.

---

### Requirement 7: Data Freshness and Caching

**User Story:** As a platform stakeholder, I want the dashboard data to be reasonably current, so that I am making decisions based on recent platform activity.

#### Acceptance Criteria

1. THE Analytics_API SHALL return data with a maximum staleness of 5 minutes.
2. THE Dashboard SHALL display the timestamp of the last successful data fetch.
3. THE Dashboard SHALL provide a manual refresh action that re-fetches all metric data for the current Time_Range.
4. WHILE a manual refresh is in progress, THE Dashboard SHALL display a loading indicator on the refresh action.
