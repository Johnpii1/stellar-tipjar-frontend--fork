# API Integration Guide

## Overview

The Stellar Tip Jar Frontend communicates with a backend API for data persistence and business logic. This guide explains how to integrate with the API.

## Base Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_STELLAR_NETWORK=testnet
```

### API Service Layer

All API calls go through `src/services/api.ts`:

```typescript
import { API_URL } from '@/lib/config';

const api = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

export async function fetchData(endpoint: string) {
  const response = await fetch(`${api.baseURL}${endpoint}`, {
    headers: api.headers,
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}
```

## Common Patterns

### GET Request

```typescript
// src/services/api.ts
export async function getCreators() {
  return fetchData('/creators');
}

// In component
import { useQuery } from '@tanstack/react-query';
import { getCreators } from '@/services/api';

export function CreatorList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['creators'],
    queryFn: getCreators,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map(creator => (
        <li key={creator.id}>{creator.name}</li>
      ))}
    </ul>
  );
}
```

### POST Request

```typescript
// src/services/api.ts
export async function sendTip(tipData: TipPayload) {
  const response = await fetch(`${API_URL}/tips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tipData),
  });

  if (!response.ok) {
    throw new Error('Failed to send tip');
  }

  return response.json();
}

// In component
import { useMutation } from '@tanstack/react-query';
import { sendTip } from '@/services/api';

export function TipForm() {
  const mutation = useMutation({
    mutationFn: sendTip,
    onSuccess: () => {
      toast.success('Tip sent successfully!');
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleSubmit = (data: TipPayload) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### Error Handling

```typescript
export async function fetchWithErrorHandling(endpoint: string) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);

    if (response.status === 401) {
      // Handle unauthorized
      window.location.href = '/login';
      return;
    }

    if (response.status === 404) {
      throw new Error('Resource not found');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}
```

## Authentication

### Token Management

```typescript
// src/lib/auth.ts
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('auth_token');
}

// In API calls
export async function authenticatedFetch(endpoint: string, options = {}) {
  const token = getAuthToken();
  
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
}
```

## Pagination

```typescript
interface PaginationParams {
  page: number;
  limit: number;
}

export async function getCreators(params: PaginationParams) {
  const query = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
  });

  return fetchData(`/creators?${query}`);
}

// In component
import { usePagination } from '@/hooks/usePagination';

export function CreatorList() {
  const { page, limit, goToPage } = usePagination();
  
  const { data } = useQuery({
    queryKey: ['creators', page, limit],
    queryFn: () => getCreators({ page, limit }),
  });

  return (
    <>
      {/* List items */}
      <Pagination
        currentPage={page}
        totalPages={data?.totalPages}
        onPageChange={goToPage}
      />
    </>
  );
}
```

## Filtering & Sorting

```typescript
interface FilterParams {
  category?: string;
  sortBy?: 'name' | 'tips' | 'date';
  order?: 'asc' | 'desc';
}

export async function getCreators(filters: FilterParams) {
  const query = new URLSearchParams();
  
  if (filters.category) query.append('category', filters.category);
  if (filters.sortBy) query.append('sortBy', filters.sortBy);
  if (filters.order) query.append('order', filters.order);

  return fetchData(`/creators?${query}`);
}
```

## Real-time Updates

### WebSocket Integration

```typescript
// src/lib/websocket/client.ts
export class WebSocketClient {
  private ws: WebSocket | null = null;

  connect(url: string) {
    this.ws = new WebSocket(url);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };
  }

  private handleMessage(data: any) {
    // Handle incoming messages
  }

  send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }
}

// In component
import { useWebSocket } from '@/hooks/useWebSocket';

export function LiveTips() {
  const { data: tips } = useWebSocket('/ws/tips');

  return (
    <div>
      {tips?.map(tip => (
        <TipCard key={tip.id} tip={tip} />
      ))}
    </div>
  );
}
```

## Caching Strategy

### Query Keys

```typescript
// Consistent query key structure
export const queryKeys = {
  creators: {
    all: ['creators'] as const,
    list: (filters: FilterParams) => [...queryKeys.creators.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.creators.all, 'detail', id] as const,
  },
  tips: {
    all: ['tips'] as const,
    list: (userId: string) => [...queryKeys.tips.all, 'list', userId] as const,
  },
};

// Usage
const { data } = useQuery({
  queryKey: queryKeys.creators.list(filters),
  queryFn: () => getCreators(filters),
});
```

### Cache Invalidation

```typescript
import { useQueryClient } from '@tanstack/react-query';

export function TipForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: sendTip,
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.tips.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.creators.all,
      });
    },
  });

  return (/* form */);
}
```

## Rate Limiting

```typescript
// src/utils/rateLimiter.ts
export class RateLimiter {
  private requests: number[] = [];
  private limit: number;
  private window: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.window = windowMs;
  }

  isAllowed(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.window);

    if (this.requests.length < this.limit) {
      this.requests.push(now);
      return true;
    }

    return false;
  }
}

// Usage
const limiter = new RateLimiter(10, 60000); // 10 requests per minute

export async function fetchWithRateLimit(endpoint: string) {
  if (!limiter.isAllowed()) {
    throw new Error('Rate limit exceeded');
  }

  return fetchData(endpoint);
}
```

## Offline Support

```typescript
// src/utils/offlineStorage.ts
export class OfflineQueue {
  private queue: Request[] = [];

  async add(request: Request) {
    this.queue.push(request);
    await this.persist();
  }

  async flush() {
    for (const request of this.queue) {
      try {
        await fetch(request);
        this.queue = this.queue.filter(r => r !== request);
      } catch (error) {
        console.error('Failed to flush request:', error);
      }
    }
    await this.persist();
  }

  private async persist() {
    // Save queue to localStorage
  }
}
```

## Testing API Calls

```typescript
// src/services/__tests__/api.test.ts
import { describe, it, expect, vi } from 'vitest';
import { getCreators } from '../api';

describe('API', () => {
  it('should fetch creators', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: 'Creator' }]),
      })
    );

    const data = await getCreators();
    expect(data).toHaveLength(1);
    expect(data[0].name).toBe('Creator');
  });
});
```

## Best Practices

1. **Always use the service layer** - Don't make fetch calls directly in components
2. **Handle errors gracefully** - Show user-friendly error messages
3. **Use TypeScript types** - Define interfaces for API responses
4. **Implement caching** - Use TanStack Query for efficient data fetching
5. **Validate data** - Use Zod for runtime validation
6. **Test API calls** - Mock fetch in tests
7. **Monitor performance** - Track API response times
8. **Implement retry logic** - Handle transient failures
9. **Use pagination** - Don't fetch all data at once
10. **Document endpoints** - Keep API documentation up to date
