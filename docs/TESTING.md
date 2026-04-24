# Testing Guide

This document outlines the testing strategy and setup for the Stellar Tip Jar Frontend.

## Testing Stack

- **Test Runner**: Vitest
- **Testing Library**: React Testing Library
- **Coverage**: v8
- **E2E Testing**: Playwright

## Test Structure

### Unit Tests
Located in `src/**/__tests__/*.test.tsx` or `*.test.ts`

- Component tests: `src/components/__tests__/`
- Hook tests: `src/hooks/__tests__/`
- Service tests: `src/services/__tests__/`
- Schema tests: `src/schemas/__tests__/`

### Integration Tests
Located alongside unit tests with `.integration.test.tsx` suffix

### E2E Tests
Located in `tests/e2e/`

## Running Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# View E2E test report
npm run test:e2e:report
```

## Test Coverage

Current coverage targets:
- Components: 80%+
- Hooks: 85%+
- Services: 75%+
- Utilities: 70%+

## Writing Tests

### Component Tests

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button Component', () => {
  const user = userEvent.setup()

  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Hook Tests

```typescript
import { renderHook, act } from '@testing-library/react'
import { useWallet } from '../useWallet'

describe('useWallet Hook', () => {
  it('initializes with disconnected state', () => {
    const { result } = renderHook(() => useWallet())
    expect(result.current.isConnected).toBe(false)
  })

  it('connects wallet', async () => {
    const { result } = renderHook(() => useWallet())
    
    await act(async () => {
      await result.current.connect()
    })
    
    expect(result.current.isConnected).toBe(true)
  })
})
```

### Service Tests

```typescript
import { api } from '../api'

describe('API Service', () => {
  it('fetches creators', async () => {
    const creators = await api.getCreators()
    expect(Array.isArray(creators)).toBe(true)
  })
})
```

## Best Practices

1. **Use semantic queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
2. **Test user behavior**: Focus on how users interact with components
3. **Mock external dependencies**: Mock API calls, localStorage, etc.
4. **Keep tests focused**: One assertion per test when possible
5. **Use descriptive names**: Test names should clearly describe what is being tested
6. **Clean up**: Use `beforeEach` to reset state between tests

## Accessibility Testing

All components should be tested for accessibility:

```typescript
it('has proper accessibility attributes', () => {
  render(<Button aria-label="Submit form">Submit</Button>)
  expect(screen.getByRole('button', { name: 'Submit form' })).toBeInTheDocument()
})
```

## CI/CD Integration

Tests run automatically on:
- Pull requests to `main` or `develop`
- Pushes to `main` or `develop`

See `.github/workflows/ci.yml` for details.

## Coverage Reports

Coverage reports are generated in the `coverage/` directory after running tests with coverage flag.

View the HTML report:
```bash
open coverage/index.html
```

## Troubleshooting

### Tests fail with "Cannot find module"
- Ensure `@` alias is configured in `vitest.config.ts`
- Check that imports use the correct path

### Tests timeout
- Increase timeout: `it('test', async () => {...}, 10000)`
- Check for unresolved promises

### Mock not working
- Ensure mock is defined before import
- Use `vi.mock()` at the top of the file

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
