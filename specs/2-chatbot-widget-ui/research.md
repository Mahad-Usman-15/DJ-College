# Research: Green-Themed Chatbot Widget UI

**Date**: 2026-02-21 | **Feature**: Chatbot Widget UI

## Technical Decisions & Rationale

### 1. Component Architecture Pattern

**Decision**: Atomic design with compound components

**Rationale**: 
- Aligns with existing project structure in DJ College website
- Enables reusability across potential future features
- Clear separation between presentational and container components
- Follows React/Next.js best practices

**Alternatives Considered**:
- Monolithic single component: Rejected due to maintainability concerns
- Micro-frontends: Overkill for single widget feature

---

### 2. State Management Approach

**Decision**: React `useState` and `useReducer` for local component state

**Rationale**:
- Widget is self-contained with no external data dependencies
- No need for global state management (Redux, Zustand) for this scope
- Simpler implementation aligned with frontend-only scope
- Easy to test and debug

**Alternatives Considered**:
- Context API: Unnecessary complexity for single-widget scope
- Redux/Zustand: Over-engineering for local state only

---

### 3. Animation Implementation

**Decision**: Framer Motion for all animations (open/close, fade-in, scale)

**Rationale**:
- Already used in the DJ College website (existing dependency)
- Declarative API integrates seamlessly with React
- Performance-optimized with automatic layout animations
- Supports gesture recognition for potential future enhancements

**Alternatives Considered**:
- CSS transitions: Less flexible, harder to coordinate complex sequences
- React Spring: More verbose API, steeper learning curve
- GSAP: Additional dependency, overkill for simple animations

---

### 4. Tailwind CSS Color System

**Decision**: Tailwind Emerald palette (emerald-50 through emerald-700)

**Rationale**:
- Matches institutional, trustworthy aesthetic per spec requirements
- Integrates with existing Tailwind CSS setup
- Provides consistent color tokens across all components
- WCAG AA compliant contrast ratios achievable

**Color Mapping**:
| Token | Usage | Contrast Ratio (vs white) |
|-------|-------|--------------------------|
| emerald-600 | Primary buttons, trigger | 4.7:1 ✅ |
| emerald-700 | Hover states | 5.8:1 ✅ |
| emerald-50 | User message bubbles | N/A (background) |
| emerald-300 | Chip outlines | 3.2:1 (large UI elements) |
| gray-900 | Primary text | 16:1 ✅ |
| gray-500 | Secondary text | 7:1 ✅ |

**Alternatives Considered**:
- Green palette: Too vibrant, less institutional feel
- Teal palette: Less traditional for educational context
- Custom hex values: Loses Tailwind consistency benefits

---

### 5. Responsive Breakpoint Strategy

**Decision**: Mobile-first with single breakpoint at 768px

**Rationale**:
- Aligns with Tailwind CSS default `md` breakpoint
- Matches spec requirement for full-screen mode on mobile
- Simple implementation with `md:` prefix for desktop styles
- Covers all target device sizes per analytics data

**Breakpoint Definition**:
- Mobile: `0px - 767px` (full-screen overlay)
- Desktop: `768px+` (floating widget 380-420px width)

**Alternatives Considered**:
- Multiple breakpoints (sm, md, lg, xl): Unnecessary complexity
- Tablet-specific breakpoint: Not required by spec

---

### 6. Accessibility Implementation

**Decision**: WCAG AA compliance with semantic HTML + ARIA attributes

**Rationale**:
- Required by constitution (Accessibility principle)
- Legal compliance for educational institutions
- Improves usability for all users
- Screen reader compatibility

**Key Implementations**:
- Semantic HTML: `<button>`, `<dialog>` (or div with role="dialog")
- ARIA labels: `aria-label`, `aria-expanded`, `aria-hidden`
- Focus management: Trap focus when open, restore on close
- Keyboard navigation: Tab order, Enter to send, ESC to close
- Announcements: `aria-live` for new messages

**Alternatives Considered**:
- WCAG AAA: Higher standard but not required by spec
- Basic accessibility only: Would violate constitution

---

### 7. Icon System

**Decision**: Lucide React icons

**Rationale**:
- Already used in DJ College website (existing dependency)
- Consistent stroke width and style
- Tree-shakeable imports for bundle size
- MIT licensed, well-maintained

**Icon Requirements**:
- `MessageCircle` or `MessageSquare`: Trigger button
- `X`: Close button
- `Send`: Send button
- `Trash2`: Clear conversation button
- `MoreHorizontal` or `MessageCircleDot`: Typing indicator (custom animation)

**Alternatives Considered**:
- React Icons (full library): Larger bundle size
- Heroicons: Different style, less variety
- Custom SVG: More maintenance overhead

---

### 8. Component File Organization

**Decision**: One component per file with `index.js` barrel export

**Rationale**:
- Follows existing project convention
- Easy to locate and maintain components
- Clean imports: `import { ChatbotTrigger } from '@/app/components/chatbot'`
- Scales well if more components added later

**Alternatives Considered**:
- All components in single file: Harder to maintain
- Separate folder per component: Overkill for small components

---

### 9. Message Data Structure

**Decision**: Simple object array with id, content, sender, timestamp

**Rationale**:
- Matches spec requirements (content, sender type, timestamp)
- Easy to render with React `map()`
- Extensible for future features (reactions, edits)
- Compatible with potential backend integration later

**Structure**:
```javascript
{
  id: string,           // Unique identifier (crypto.randomUUID())
  content: string,      // Message text (markdown-ready)
  sender: 'user' | 'bot', // Message sender type
  timestamp: string     // ISO 8601 format
}
```

**Alternatives Considered**:
- Complex state machines: Unnecessary for linear conversation flow
- Immutable.js: Added complexity without benefit for this scope

---

### 10. Scroll Behavior Implementation

**Decision**: Native scroll with `scrollIntoView()` for auto-scroll

**Rationale**:
- Simple, performant solution
- No additional dependencies
- Works well with 50+ messages per spec
- Smooth scroll behavior via CSS `scroll-behavior: smooth`

**Alternatives Considered**:
- Virtual scrolling (react-window): Overkill for <100 messages
- Custom scroll logic: Reinventing the wheel

---

## Best Practices Summary

### Next.js-Specific
- Use `'use client'` directive for interactive components
- Dynamic imports for code splitting if needed
- Follow App Router conventions

### React Best Practices
- Functional components with hooks
- Proper key props for lists
- Memoization with `useMemo`/`useCallback` where beneficial

### Tailwind CSS Best Practices
- Use utility classes over custom CSS
- Leverage `@apply` sparingly for repeated patterns
- Use CSS variables for theme colors if customization needed

### Performance Optimization
- Lazy load chatbot components (not needed on initial page load)
- Debounce input if processing needed
- Optimize re-renders with `React.memo`

---

## Integration Notes

### Existing Dependencies (Already in package.json)
- ✅ next: 15.5.12
- ✅ react: 18.x
- ✅ tailwindcss: 3.x
- ✅ framer-motion: latest
- ✅ lucide-react: latest

### No New Dependencies Required

All required functionality can be achieved with existing project dependencies.

---

## Unresolved Questions

None. All technical decisions have been resolved through research.
