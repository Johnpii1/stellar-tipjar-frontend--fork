# Implementation Tasks: Storybook Setup

## Tasks

- [ ] 1. Install dependencies and scaffold Storybook configuration
  - [ ] 1.1 Install Storybook and required packages
    - Run `npx storybook@latest init --type nextjs --no-dev` to scaffold, then adjust, OR install manually: `@storybook/nextjs`, `@storybook/react`, `@storybook/addon-essentials`, `storybook`, `storybook-dark-mode`, `storybook-addon-module-mock` as devDependencies
    - Add `"storybook": "storybook dev -p 6006"` and `"build-storybook": "storybook build"` scripts to `package.json`
  - [ ] 1.2 Create `.storybook/main.ts`
    - Set `framework: { name: "@storybook/nextjs", options: {} }`
    - Set `stories: ["../src/components/**/*.stories.tsx"]`
    - Register addons: `@storybook/addon-essentials`, `storybook-dark-mode`, `storybook-addon-module-mock`
  - [ ] 1.3 Create `.storybook/preview.ts`
    - Import `../src/styles/globals.css`
    - Set `actions: { argTypesRegex: "^on[A-Z].*" }`
    - Set `darkMode` parameter with `dark.appBg: "#151515"`, `light.appBg: "#f7f2e8"`, `classTarget: "html"`, `stylePreview: true`
    - Add global decorator that applies dark-mode CSS variable overrides to the preview `<html>` element

- [ ] 2. Write Button component stories
  - [ ] 2.1 Create `src/components/Button.stories.tsx`
    - Export default meta: `component: Button`, `title: "Components/Button"`, `tags: ["autodocs"]`
    - Add `argTypes` for `variant` as a `select` control
    - Export named stories: `Primary`, `Secondary`, `Ghost`, `Disabled`, `Loading`
    - Export `AllVariants` story rendering all three variants side-by-side

- [ ] 3. Write Navbar component stories
  - [ ] 3.1 Create `src/components/Navbar.stories.tsx`
    - Export default meta: `component: Navbar`, `title: "Components/Navbar"`, `parameters: { layout: "fullscreen" }`
    - Create `mockWalletDecorator` helper that wraps stories in a `WalletContext.Provider` with a controlled value
    - Export `Default` story (disconnected wallet state) with mock decorator
    - Export `WalletConnected` story with mocked address, network, and balance

- [ ] 4. Write SectionCard component stories
  - [ ] 4.1 Create `src/components/SectionCard.stories.tsx`
    - Export default meta: `component: SectionCard`, `title: "Components/SectionCard"`, `tags: ["autodocs"]`
    - Exclude `icon` from Controls via `argTypes: { icon: { control: false } }`
    - Export `Default` story with representative title, description, and icon
    - Export `LongContent` story with a description exceeding two lines

- [ ] 5. Write WalletConnector component stories
  - [ ] 5.1 Create `src/components/WalletConnector.stories.tsx`
    - Export default meta: `component: WalletConnector`, `title: "Components/WalletConnector"`
    - Use `storybook-addon-module-mock` to mock `@/hooks/useWallet` per story
    - Export `Disconnected` story (isConnected: false, isConnecting: false)
    - Export `Connecting` story (isConnecting: true)
    - Export `Connected` story (isConnected: true, with mocked address/network/balance)
    - Export `WithError` story (error: "Freighter wallet extension is not installed.")

- [ ] 6. Write ErrorBoundary and ErrorFallback component stories
  - [ ] 6.1 Create `src/components/ErrorFallback.stories.tsx`
    - Export default meta: `component: ErrorFallback`, `title: "Components/ErrorFallback"`, `tags: ["autodocs"]`
    - Export `Default` story with a synthetic `new Error("Something went wrong")` and no-op reset
    - Export `WithDetails` story with `showDetails: true` and an error with a message
  - [ ] 6.2 Create `src/components/ErrorBoundary.stories.tsx`
    - Export default meta: `component: ErrorBoundary`, `title: "Components/ErrorBoundary"`
    - Create a `ThrowingChild` helper component that throws on mount
    - Export `ThrowingChild` story demonstrating the boundary catching the error

- [ ] 7. Write FormInput component stories
  - [ ] 7.1 Create `src/components/forms/FormInput.stories.tsx`
    - Export default meta: `component: FormInput`, `title: "Components/Forms/FormInput"`, `tags: ["autodocs"]`
    - Create a stub `registration` object: `{ name: "field", ref: () => {}, onChange: fn(), onBlur: fn() }`
    - Export `Default` story with label and placeholder, no error
    - Export `WithError` story with `error: "This field is required"`
    - Export `Disabled` story with `disabled: true`

- [ ] 8. Write FormError component stories
  - [ ] 8.1 Create `src/components/forms/FormError.stories.tsx`
    - Export default meta: `component: FormError`, `title: "Components/Forms/FormError"`, `tags: ["autodocs"]`
    - Export `WithMessage` story with a non-empty message string
    - Export `NoMessage` story with `message: undefined`

- [ ] 9. Write TipForm component stories
  - [ ] 9.1 Create `src/components/forms/TipForm.stories.tsx`
    - Export default meta: `component: TipForm`, `title: "Components/Forms/TipForm"`, `tags: ["autodocs"]`
    - Use `storybook-addon-module-mock` to mock `@/services/api` `createTipIntent` per story
    - Export `Default` story with `username: "alice"`, `defaultAssetCode: "XLM"`
    - Export `SubmitSuccess` story with mock resolving to `{ intentId: "abc123", checkoutUrl: null }`
    - Export `SubmitError` story with mock rejecting with `new Error("Network error")`

- [ ] 10. Set up test infrastructure and write property-based tests
  - [ ] 10.1 Install test dependencies
    - Install `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@fast-check/vitest` as devDependencies
  - [ ] 10.2 Create `vitest.config.ts`
    - Configure `jsdom` environment, `@/` alias, and `setupFiles: ["./src/test/setup.ts"]`
  - [ ] 10.3 Create `src/test/setup.ts`
    - Import `@testing-library/jest-dom/vitest`
  - [ ] 10.4 Write property tests for Button (Properties 1 and 2)
    - P1: For any variant in `["primary","secondary","ghost"]`, rendered button className contains the correct variant class
    - P2: For any Button with `disabled={true}`, the button element has the disabled attribute
  - [ ] 10.5 Write property test for SectionCard (Property 3)
    - P3: For any non-empty title and description strings, rendered SectionCard contains both strings
  - [ ] 10.6 Write property tests for ErrorFallback and ErrorBoundary (Properties 4 and 5)
    - P4: For any Error with non-empty message, ErrorFallback with showDetails=true renders the message
    - P5: For any Error thrown by a child, ErrorBoundary renders ErrorFallback instead of crashing
  - [ ] 10.7 Write property tests for FormInput and FormError (Properties 6 and 7)
    - P6: For any non-empty error string, FormInput renders error border class and the error message text
    - P7: FormError renders message paragraph for non-empty strings, renders nothing for undefined
  - [ ] 10.8 Write property tests for TipForm (Properties 8 and 9)
    - P8: For any resolved createTipIntent response, TipForm shows success message and no error message
    - P9: For any rejected createTipIntent error, TipForm shows error message and no success message
  - [ ] 10.9 Add `"test": "vitest --run"` script to `package.json`
