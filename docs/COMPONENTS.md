# Component Usage Guide

## Overview

This guide explains how to use and create components in the Stellar Tip Jar Frontend.

## Component Structure

### Basic Component

```typescript
// src/components/Button.tsx
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition';
  const variantStyles = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
}
```

### Client Component

```typescript
// src/components/Counter.tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## Common Patterns

### Props Interface

```typescript
interface ComponentProps {
  // Required props
  title: string;
  
  // Optional props with defaults
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  
  // Event handlers
  onClick?: () => void;
  onChange?: (value: string) => void;
  
  // Children
  children?: React.ReactNode;
  
  // HTML attributes
  className?: string;
  disabled?: boolean;
}
```

### Conditional Rendering

```typescript
export function Card({ title, description, isLoading }: CardProps) {
  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="border rounded-lg p-4">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
```

### Composition

```typescript
// Parent component
export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50">
      <div className="bg-white rounded-lg p-6">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// Usage
export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Modal Content</h2>
      </Modal>
    </>
  );
}
```

## Styling

### TailwindCSS

```typescript
export function Card({ variant = 'default' }: CardProps) {
  const styles = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg',
    outlined: 'border-2 border-purple-600',
  };

  return (
    <div className={`rounded-lg p-4 ${styles[variant]}`}>
      {/* content */}
    </div>
  );
}
```

### CSS Modules

```typescript
// src/components/Button.module.css
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
}

.primary {
  background-color: #8b5cf6;
  color: white;
}

// src/components/Button.tsx
import styles from './Button.module.css';

export function Button({ variant = 'primary' }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      Click me
    </button>
  );
}
```

## Hooks Integration

### Using Hooks

```typescript
'use client';

import { useToast } from '@/hooks/useToast';
import { useQuery } from '@tanstack/react-query';

export function CreatorList() {
  const { toast } = useToast();
  const { data, isLoading, error } = useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      const res = await fetch('/api/creators');
      return res.json();
    },
  });

  if (error) {
    toast.error('Failed to load creators');
  }

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {data?.map(creator => (
        <div key={creator.id}>{creator.name}</div>
      ))}
    </div>
  );
}
```

### Custom Hooks

```typescript
// src/hooks/useFormState.ts
import { useState, useCallback } from 'react';

export function useFormState<T>(initialState: T) {
  const [state, setState] = useState(initialState);

  const updateField = useCallback((field: keyof T, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return { state, updateField, reset };
}

// Usage
export function MyForm() {
  const { state, updateField, reset } = useFormState({
    name: '',
    email: '',
  });

  return (
    <form>
      <input
        value={state.name}
        onChange={e => updateField('name', e.target.value)}
      />
    </form>
  );
}
```

## Accessibility

### ARIA Attributes

```typescript
export function Button({ children, disabled }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      aria-disabled={disabled}
      aria-label="Submit form"
      className="..."
    >
      {children}
    </button>
  );
}
```

### Keyboard Navigation

```typescript
export function Menu({ items }: MenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        setSelectedIndex(prev => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        setSelectedIndex(prev => (prev - 1 + items.length) % items.length);
        break;
    }
  };

  return (
    <ul onKeyDown={handleKeyDown} role="menu">
      {items.map((item, index) => (
        <li
          key={item.id}
          role="menuitem"
          aria-selected={index === selectedIndex}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
}
```

## Testing Components

### Unit Tests

```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

## Component Organization

### Folder Structure

```
src/components/
├── Button.tsx              # Simple component
├── Modal/
│   ├── index.tsx          # Main component
│   ├── ModalHeader.tsx    # Sub-component
│   ├── ModalBody.tsx      # Sub-component
│   └── Modal.module.css   # Styles
├── Form/
│   ├── index.tsx
│   ├── FormField.tsx
│   └── __tests__/
│       └── Form.test.tsx
└── __tests__/
    └── Button.test.tsx
```

### Exporting Components

```typescript
// src/components/Modal/index.tsx
export { Modal } from './Modal';
export { ModalHeader } from './ModalHeader';
export { ModalBody } from './ModalBody';

// Usage
import { Modal, ModalHeader, ModalBody } from '@/components/Modal';
```

## Performance Optimization

### Memoization

```typescript
import { memo } from 'react';

interface ItemProps {
  id: string;
  title: string;
}

export const Item = memo(function Item({ id, title }: ItemProps) {
  return <div>{title}</div>;
});
```

### Code Splitting

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});

export function Page() {
  return <HeavyComponent />;
}
```

## Best Practices

1. **Keep components small** - Single responsibility principle
2. **Use TypeScript** - Define proper types for props
3. **Avoid prop drilling** - Use context for deeply nested data
4. **Memoize expensive components** - Use React.memo when needed
5. **Write tests** - Aim for good coverage
6. **Document props** - Use JSDoc comments
7. **Use semantic HTML** - Improve accessibility
8. **Handle loading states** - Show feedback to users
9. **Error boundaries** - Catch and handle errors gracefully
10. **Reuse components** - Build a component library

## Common Mistakes

❌ **Don't:**
```typescript
// Prop drilling
<Component prop1={prop1} prop2={prop2} prop3={prop3} />

// Inline functions
<button onClick={() => handleClick()}>Click</button>

// Missing keys in lists
{items.map(item => <Item item={item} />)}
```

✅ **Do:**
```typescript
// Use context
<Provider value={{ prop1, prop2, prop3 }}>
  <Component />
</Provider>

// Memoize functions
const handleClick = useCallback(() => { /* ... */ }, []);
<button onClick={handleClick}>Click</button>

// Add keys
{items.map(item => <Item key={item.id} item={item} />)}
```
