# Architecture Overview

## Project Structure

Stellar Tip Jar Frontend is built with Next.js 14+ using the App Router, TypeScript, and TailwindCSS.

```
src/
├── app/                 # Next.js App Router
│   ├── [locale]/       # Internationalization routes
│   ├── creator/        # Creator profile routes
│   ├── dashboard/      # User dashboard
│   ├── explore/        # Creator discovery
│   ├── layout.tsx      # Root layout
│   └── ...
├── components/         # Reusable React components
│   ├── Button.tsx
│   ├── Navbar.tsx
│   ├── ShareButtons.tsx
│   └── ...
├── hooks/             # Custom React hooks
│   ├── useWallet.ts
│   ├── usePWA.ts
│   └── ...
├── lib/               # Core utilities and libraries
│   ├── analytics/     # Analytics and performance tracking
│   ├── pwa/          # PWA utilities
│   ├── stellar/      # Stellar blockchain integration
│   └── ...
├── services/         # API service layer
│   ├── api.ts
│   ├── walletService.ts
│   └── ...
├── contexts/         # React contexts
│   ├── WalletContext.tsx
│   ├── ThemeContext.tsx
│   └── ...
├── types/            # TypeScript type definitions
├── utils/            # Helper functions
└── styles/           # Global styles
```

## Technology Stack

### Frontend Framework
- **Next.js 14+**: React framework with App Router
- **React 19+**: UI library
- **TypeScript**: Type safety

### Styling
- **TailwindCSS 4+**: Utility-first CSS framework
- **Framer Motion**: Animation library

### State Management
- **React Context**: Global state (theme, wallet, currency)
- **TanStack Query**: Server state management
- **React Hook Form**: Form state management

### Blockchain
- **Stellar SDK**: Stellar blockchain integration
- **Freighter API**: Wallet connection

### Testing
- **Vitest**: Unit testing
- **Playwright**: E2E testing
- **React Testing Library**: Component testing

### Build & Deployment
- **Next.js**: Build and deployment
- **Vercel**: Recommended hosting

## Key Features

### 1. Performance Monitoring (Web Vitals)
- Tracks Core Web Vitals (LCP, FID, CLS, FCP, TTFB)
- Sends metrics to analytics endpoint
- Performance budgets for development

**Files:**
- `src/lib/webVitals.ts`
- `src/lib/analytics/performance.ts`
- `src/components/PerformanceMonitor.tsx`

### 2. Social Sharing
- Share buttons for Twitter, Facebook, LinkedIn
- Copy link to clipboard
- Native share API for mobile
- Open Graph and Twitter Card meta tags

**Files:**
- `src/components/ShareButtons.tsx`
- `src/utils/shareUtils.ts`
- `src/app/layout.tsx` (metadata)

### 3. Progressive Web App (PWA)
- Service Worker for offline support
- Push notifications
- Background sync
- Install prompt
- App manifest

**Files:**
- `public/sw.js`
- `public/manifest.json`
- `src/lib/pwa/manager.ts`
- `src/hooks/usePWA.ts`

### 4. Internationalization (i18n)
- Multi-language support
- Dynamic locale routing
- Translation files in `messages/` and `src/i18n/locales/`

**Files:**
- `src/i18n/routing.ts`
- `src/i18n/request.ts`
- `messages/` directory

### 5. Wallet Integration
- Freighter wallet connection
- Stellar transaction handling
- Wallet context for global state

**Files:**
- `src/contexts/WalletContext.tsx`
- `src/lib/stellar/freighter.ts`
- `src/hooks/useWallet.ts`

## Data Flow

### API Communication
```
Component
  ↓
Hook (useQuery/useMutation)
  ↓
TanStack Query
  ↓
Service Layer (src/services/api.ts)
  ↓
Fetch API
  ↓
Backend API
```

### State Management
```
Global State (Context)
  ├── Theme (ThemeContext)
  ├── Wallet (WalletContext)
  ├── Currency (CurrencyContext)
  └── Toast (ToastContext)

Server State (TanStack Query)
  ├── Creators
  ├── Tips
  └── User Data

Local State (useState)
  └── Component-specific state
```

## Component Hierarchy

```
RootLayout
├── PerformanceMonitor
├── ThemeProvider
├── I18nProvider
├── CurrencyProvider
├── WalletProvider
├── ReactQueryProvider
├── WebSocketProvider
├── ToastProvider
│   ├── Navbar
│   ├── main (PageTransition)
│   │   └── Route Components
│   ├── Footer
│   ├── InstallPrompt
│   ├── UpdatePrompt
│   ├── PWAInitializer
│   └── ToastContainer
```

## API Integration

### Service Layer Pattern
```typescript
// src/services/api.ts
export async function fetchCreators() {
  const response = await fetch(`${API_URL}/creators`);
  return response.json();
}

// In component
const { data } = useQuery({
  queryKey: ['creators'],
  queryFn: fetchCreators,
});
```

### Error Handling
- Global error boundary
- Toast notifications for user feedback
- Retry logic with exponential backoff
- Offline queue for failed requests

## Performance Optimization

### Code Splitting
- Route-based code splitting (Next.js automatic)
- Dynamic imports for heavy components
- Lazy loading for images

### Caching Strategy
- Service Worker caching (network-first for API, cache-first for assets)
- Browser caching headers
- TanStack Query caching

### Image Optimization
- Next.js Image component
- Responsive images
- WebP format support

## Security

### Best Practices
- Content Security Policy (CSP)
- HTTPS only
- Secure headers
- Input validation with Zod
- XSS protection

### Wallet Security
- No private key storage
- Freighter wallet integration
- Transaction signing only

## Testing Strategy

### Unit Tests
- Component logic
- Utility functions
- Hooks

### Integration Tests
- API communication
- Context providers
- Form submissions

### E2E Tests
- User workflows
- Critical paths
- Cross-browser compatibility

## Deployment

### Environment Variables
```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
```

### Build Process
```bash
npm run build
npm run start
```

### CI/CD
- GitHub Actions workflows
- Automated testing
- Deployment on merge to main

## Monitoring & Analytics

### Web Vitals
- Automatic collection via `web-vitals` library
- Sent to `/api/analytics` endpoint
- Performance budgets in development

### Error Tracking
- Global error boundary
- Error logging service
- User feedback collection

## Future Improvements

- [ ] Storybook for component documentation
- [ ] GraphQL integration
- [ ] Advanced caching strategies
- [ ] Real-time notifications
- [ ] Analytics dashboard
- [ ] A/B testing framework
