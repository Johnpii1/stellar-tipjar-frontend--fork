# Requirements Document

## Introduction

This feature adds Storybook to the `stellar-tipjar-frontend` Next.js/TypeScript/Tailwind project to provide a visual component library and isolated development environment. Storybook will document all existing UI components with interactive stories, support dark mode theming, and expose component props via the Controls addon so developers and designers can explore component variants without running the full application.

## Glossary

- **Storybook**: The open-source tool (v8+) used to build, document, and test UI components in isolation.
- **Story**: A named render of a component in a specific state, defined in a `*.stories.tsx` file co-located with the component.
- **Controls**: The Storybook Controls addon that auto-generates interactive prop controls from TypeScript types.
- **Decorator**: A Storybook wrapper function applied globally or per-story to inject providers, styles, or layout context.
- **CSF**: Component Story Format — the standard ES module format for writing stories (`export default` meta + named exports).
- **Dark_Mode_Addon**: The `@storybook/addon-themes` or `storybook-dark-mode` addon that toggles the Tailwind `dark` class on the preview iframe.
- **Preview**: The Storybook iframe that renders stories, configured via `.storybook/preview.ts`.
- **Main_Config**: The Storybook build configuration file at `.storybook/main.ts`.
- **Global_Decorator**: A decorator registered in `.storybook/preview.ts` that wraps every story.
- **CSS_Variable**: A custom property defined in `src/styles/globals.css` (e.g. `--surface`, `--background`) used by components.
- **Tailwind_Theme**: The custom color tokens (`ink`, `sunrise`, `wave`, `moss`, `error`, `success`) defined in `tailwind.config.ts`.
- **WalletContext**: The React context provided by `src/contexts/WalletContext.tsx` that `WalletConnector` depends on.
- **ErrorBoundary**: The class component in `src/components/ErrorBoundary.tsx` that catches render errors.

---

## Requirements

### Requirement 1: Storybook Installation and Configuration

**User Story:** As a developer, I want Storybook installed and runnable in the project, so that I can view and develop components in isolation.

#### Acceptance Criteria

1. THE Storybook SHALL be configured with the `@storybook/nextjs` framework preset so that Next.js features (Image, Link, font optimisation) work inside stories without additional mocking.
2. THE Main_Config SHALL resolve the `@/` path alias to `src/` to match the project's `tsconfig.json` path mapping.
3. WHEN the developer runs `npm run storybook`, THE Storybook SHALL start a local dev server on port 6006 and open the browser automatically.
4. WHEN the developer runs `npm run build-storybook`, THE Storybook SHALL produce a static build in the `storybook-static/` directory without TypeScript or build errors.
5. THE Main_Config SHALL include the `src/components/**/*.stories.tsx` glob so that all component story files are discovered automatically.
6. THE Preview SHALL import `src/styles/globals.css` so that Tailwind utility classes and CSS_Variable definitions are applied to every story.

---

### Requirement 2: Dark Mode Support

**User Story:** As a developer, I want to toggle dark mode inside Storybook, so that I can verify components render correctly in both light and dark themes.

#### Acceptance Criteria

1. THE Dark_Mode_Addon SHALL be installed and registered in Main_Config so that a dark/light toggle appears in the Storybook toolbar.
2. WHEN the dark mode toggle is activated, THE Dark_Mode_Addon SHALL add the `dark` class to the `<html>` element of the Preview iframe so that Tailwind's `dark:` variants take effect.
3. THE Preview SHALL define a `darkMode` parameter that sets the dark background to `#151515` and the light background to `#f7f2e8` to match the project's CSS_Variable values.
4. THE Global_Decorator SHALL apply the `--surface`, `--background`, `--foreground`, and `--accent` CSS_Variable values appropriate to the active theme so that components using CSS variables render correctly in both modes.

---

### Requirement 3: Controls Addon Integration

**User Story:** As a developer, I want interactive controls for every component prop, so that I can explore component variants without editing code.

#### Acceptance Criteria

1. THE Controls addon (`@storybook/addon-essentials`) SHALL be installed and registered so that the Controls panel appears for every story.
2. THE Preview SHALL set `argTypesRegex: "^on[A-Z].*"` in the `actions` parameter so that callback props are automatically logged in the Actions panel.
3. WHEN a story exports `argTypes`, THE Controls addon SHALL render the appropriate control widget (e.g. `select` for union types, `boolean` for booleans, `text` for strings) matching the TypeScript prop type.
4. THE Controls addon SHALL infer arg types from TypeScript interfaces without requiring manual `argTypes` declarations for primitive props.

---

### Requirement 4: Button Component Stories

**User Story:** As a developer, I want stories for the Button component, so that I can see all variants and interactive states in isolation.

#### Acceptance Criteria

1. THE Button story file SHALL export a default meta object with `component: Button`, a `title` of `"Components/Button"`, and `tags: ["autodocs"]`.
2. THE Button story file SHALL include named story exports covering: `Primary`, `Secondary`, `Ghost`, `Disabled`, and `Loading` states.
3. WHEN the `variant` arg is changed via Controls, THE Button story SHALL re-render with the selected variant style applied.
4. WHEN the `disabled` arg is set to `true`, THE Button story SHALL render the button in a visually disabled state with `pointer-events: none`.
5. THE Button story file SHALL include an `AllVariants` story that renders `Primary`, `Secondary`, and `Ghost` variants side-by-side for visual comparison.

---

### Requirement 5: Navbar Component Stories

**User Story:** As a developer, I want stories for the Navbar component, so that I can verify layout and navigation links render correctly.

#### Acceptance Criteria

1. THE Navbar story file SHALL export a default meta with `component: Navbar` and `title: "Components/Navbar"`.
2. THE Navbar story file SHALL provide a `WalletContext` mock via a story-level decorator so that the embedded `WalletConnector` renders without runtime errors.
3. THE Navbar story file SHALL include a `Default` story showing the navbar with a disconnected wallet state.
4. THE Navbar story file SHALL include a `WalletConnected` story showing the navbar with a mocked connected wallet displaying a short address, network label, and XLM balance.
5. THE Navbar story SHALL set the story layout to `"fullscreen"` so the sticky header renders at full viewport width.

---

### Requirement 6: SectionCard Component Stories

**User Story:** As a developer, I want stories for the SectionCard component, so that I can preview card content and icon slot variations.

#### Acceptance Criteria

1. THE SectionCard story file SHALL export a default meta with `component: SectionCard`, `title: "Components/SectionCard"`, and `tags: ["autodocs"]`.
2. THE SectionCard story file SHALL include a `Default` story with representative `title`, `description`, and `icon` prop values.
3. WHEN the `title` or `description` args are edited via Controls, THE SectionCard story SHALL re-render with the updated text immediately.
4. THE SectionCard story file SHALL include a `LongContent` story that demonstrates wrapping behaviour when `description` exceeds two lines.

---

### Requirement 7: WalletConnector Component Stories

**User Story:** As a developer, I want stories for the WalletConnector component, so that I can preview connected and disconnected wallet states without a real wallet extension.

#### Acceptance Criteria

1. THE WalletConnector story file SHALL export a default meta with `component: WalletConnector` and `title: "Components/WalletConnector"`.
2. THE WalletConnector story file SHALL mock the `useWallet` hook via a story-level decorator or module mock so that no real Freighter wallet extension is required.
3. THE WalletConnector story file SHALL include a `Disconnected` story showing the "Connect Wallet" button in its default state.
4. THE WalletConnector story file SHALL include a `Connecting` story showing the button in the `isConnecting: true` state with "Connecting..." label and `cursor-wait` styling.
5. THE WalletConnector story file SHALL include a `Connected` story showing the wallet info panel with a mocked address, network, and balance.
6. THE WalletConnector story file SHALL include a `WithError` story showing the error message rendered below the connect button.

---

### Requirement 8: ErrorBoundary and ErrorFallback Component Stories

**User Story:** As a developer, I want stories for the error handling components, so that I can verify error UI renders correctly without triggering real application errors.

#### Acceptance Criteria

1. THE ErrorFallback story file SHALL export a default meta with `component: ErrorFallback`, `title: "Components/ErrorFallback"`, and `tags: ["autodocs"]`.
2. THE ErrorFallback story file SHALL include a `Default` story passing a synthetic `Error` object and a no-op `reset` function.
3. THE ErrorFallback story file SHALL include a `WithDetails` story where `showDetails` is `true`, displaying the error message in the pre-formatted block.
4. THE ErrorBoundary story file SHALL export a default meta with `component: ErrorBoundary` and `title: "Components/ErrorBoundary"`.
5. THE ErrorBoundary story file SHALL include a `ThrowingChild` story that renders a child component which throws on mount, demonstrating the boundary catching the error and rendering `ErrorFallback`.
6. WHEN the `reset` control is invoked in the ErrorFallback story, THE Controls addon SHALL log the action in the Actions panel.

---

### Requirement 9: FormInput Component Stories

**User Story:** As a developer, I want stories for the FormInput component, so that I can preview all input states including validation errors.

#### Acceptance Criteria

1. THE FormInput story file SHALL export a default meta with `component: FormInput`, `title: "Components/Forms/FormInput"`, and `tags: ["autodocs"]`.
2. THE FormInput story file SHALL provide a stub `registration` object compatible with `UseFormRegisterReturn` so that stories render without a live `react-hook-form` context.
3. THE FormInput story file SHALL include a `Default` story with a label and placeholder but no error.
4. THE FormInput story file SHALL include a `WithError` story where the `error` prop is set to a validation message string, showing the red border and `FormError` message.
5. THE FormInput story file SHALL include a `Disabled` story where the input is disabled.
6. WHEN the `label` or `error` args are changed via Controls, THE FormInput story SHALL re-render with the updated values immediately.

---

### Requirement 10: FormError Component Stories

**User Story:** As a developer, I want stories for the FormError component, so that I can verify error message rendering and accessibility attributes.

#### Acceptance Criteria

1. THE FormError story file SHALL export a default meta with `component: FormError`, `title: "Components/Forms/FormError"`, and `tags: ["autodocs"]`.
2. THE FormError story file SHALL include a `WithMessage` story where `message` is set to a non-empty string, rendering the error paragraph.
3. THE FormError story file SHALL include a `NoMessage` story where `message` is `undefined`, confirming the component renders nothing (empty output).
4. WHEN the `message` arg is cleared via Controls, THE FormError story SHALL update to render nothing without a page error.

---

### Requirement 11: TipForm Component Stories

**User Story:** As a developer, I want stories for the TipForm component, so that I can preview the full form in various submission states without making real API calls.

#### Acceptance Criteria

1. THE TipForm story file SHALL export a default meta with `component: TipForm`, `title: "Components/Forms/TipForm"`, and `tags: ["autodocs"]`.
2. THE TipForm story file SHALL mock the `createTipIntent` API function via a story-level parameter or module mock so that form submission does not make real network requests.
3. THE TipForm story file SHALL include a `Default` story with `username: "alice"` and `defaultAssetCode: "XLM"` showing the empty form.
4. THE TipForm story file SHALL include a `SubmitSuccess` story that pre-configures the mock to resolve successfully, demonstrating the success message state.
5. THE TipForm story file SHALL include a `SubmitError` story that pre-configures the mock to reject with an error, demonstrating the error message state.
6. WHEN the `username` arg is changed via Controls, THE TipForm story SHALL pass the updated value to the form's submit handler.

---

### Requirement 12: Autodocs Generation

**User Story:** As a developer, I want auto-generated documentation pages for each component, so that I can reference prop tables and usage examples without writing docs manually.

#### Acceptance Criteria

1. THE Storybook SHALL generate an autodocs page for every story file that includes `tags: ["autodocs"]` in its default meta export.
2. THE autodocs page SHALL display a prop table derived from the component's TypeScript interface, listing each prop's name, type, default value, and description.
3. THE autodocs page SHALL render a live interactive example using the first named story export as the default canvas.
4. WHEN a JSDoc comment is added to a prop in the component's TypeScript interface, THE autodocs page SHALL display that comment as the prop description in the prop table.
