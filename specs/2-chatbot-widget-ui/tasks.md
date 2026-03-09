# Tasks: Green-Themed Chatbot Widget UI

**Input**: Design documents from `/specs/2-chatbot-widget-ui/`
**Prerequisites**: plan.md (✅), spec.md (✅), research.md (✅), data-model.md (✅), contracts/ (✅), quickstart.md (✅)

**Tests**: Component unit tests included as optional verification tasks

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and component directory structure

- [X] T001 Create chatbot component directory structure at `app/components/chatbot/`
- [X] T002 [P] Verify Next.js 15.5.12 and React 18+ are installed in package.json
- [X] T003 [P] Verify Tailwind CSS 3+ is configured in tailwind.config.js
- [X] T004 [P] Verify Framer Motion is installed (`npm install framer-motion`)
- [X] T005 [P] Verify Lucide React is installed (`npm install lucide-react`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 [P] Add CSS variables for chatbot colors in `app/globals.css` (emerald palette)
- [X] T007 [P] Create useChatbot custom hook with reducer in `app/components/chatbot/useChatbot.js`
- [X] T008 [P] Define WELCOME_MESSAGE constant per spec (professional institutional greeting)
- [X] T009 [P] Define SUGGESTED_QUESTIONS array in useChatbot.js (3 questions: programs, admissions, contact)
- [X] T010 [P] Implement chatbotReducer with all action types (OPEN, CLOSE, ADD_MESSAGE, SET_TYPING, SET_INPUT, CLEAR_CONVERSATION)
- [X] T011 Create barrel exports file `app/components/chatbot/index.js`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Access and Open Chatbot Widget (Priority: P1) 🎯 MVP

**Goal**: Implement floating trigger button and animated chat window container

**Independent Test**: Can be fully tested by verifying the floating trigger button is visible, clickable, and opens the chat window successfully.

### Implementation for User Story 1

- [X] T012 [P] [US1] Implement ChatbotTrigger component in `app/components/chatbot/ChatbotTrigger.jsx`
  - Fixed position button (bottom: 20px, right: 20px)
  - Green circular button with emerald-600 background
  - MessageCircle icon (closed state) / X icon (open state)
  - Hover, active, focus states per spec
  - aria-label and aria-expanded attributes

- [X] T013 [P] [US1] Implement ChatbotWindow component in `app/components/chatbot/ChatbotWindow.jsx`
  - Fixed positioning above trigger (right-aligned, 8-12px gap)
  - Max width 380-420px (desktop)
  - Scale + fade animation (300ms) using Framer Motion
  - role="dialog", aria-modal, aria-labelledby attributes
  - ESC key to close functionality
  - Focus trap when open

- [X] T014 [US1] Implement ChatbotWidget container in `app/components/chatbot/ChatbotWidget.jsx`
  - Import and compose ChatbotTrigger and ChatbotWindow
  - Wire up toggle functionality using useChatbot hook
  - Conditional rendering based on isOpen state

- [X] T015 [US1] Integrate ChatbotWidget into root layout in `app/layout.js`
  - Import ChatbotWidget component
  - Add to body after children
  - Verify widget appears on all pages

- [X] T015a [P] [US1] Verify widget z-index doesn't block core navigation (FR-019)
  - Check site header/navigation z-index value
  - Ensure widget z-index (z-50) is less than navigation z-index
  - Test widget positioning against site header in DevTools
  - Add visual verification that navigation remains clickable

- [X] T016 [US1] Add mobile responsive styles in `app/globals.css`
  - Full-screen mode for screens ≤768px
  - Media query overriding window position/size

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently
- ✅ Trigger button visible in bottom-right corner
- ✅ Trigger button fixed position (stays when scrolling)
- ✅ Click trigger opens chat with smooth animation
- ✅ Click close button closes chat
- ✅ ESC key closes chat
- ✅ Mobile: Full-screen mode activates at ≤768px

---

## Phase 4: User Story 2 - View Welcome Message and Suggested Questions (Priority: P2)

**Goal**: Display welcome message and suggested question chips on first open

**Independent Test**: Can be fully tested by opening the chat and verifying the welcome message and suggested question chips appear correctly.

### Implementation for User Story 2

- [X] T017 [P] [US2] Implement ChatbotHeader component in `app/components/chatbot/ChatbotHeader.jsx`
  - Display "DJ College Assistant" title
  - Online status indicator (green dot)
  - Typing status indicator (yellow pulsing dot)
  - Close button (X icon)
  - Clear conversation button (Trash2 icon)
  - Emerald-600 background with white text

- [X] T018 [P] [US2] Implement SuggestedQuestions component in `app/components/chatbot/SuggestedQuestions.jsx`
  - Render 3 question chips from SUGGESTED_QUESTIONS
  - Green-outline variant (emerald-300 border)
  - Hover: emerald-50 background
  - Focus: visible focus ring
  - onClick handler to select question

- [X] T019 [US2] Update ChatbotWidget to show welcome state
  - Pass isOpen state to ChatbotWindow
  - Render ChatbotHeader with status
  - Render SuggestedQuestions when showWelcome is true
  - Wire up onSelect to sendMessage function

- [X] T020 [US2] Update useChatbot hook for welcome message logic
  - Add hasOpened state tracking
  - Show WELCOME_MESSAGE on first open only
  - Clear conversation resets hasOpened to false

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently
- ✅ All US1 tests pass
- ✅ Welcome message displays on first open
- ✅ 3 suggested question chips appear below welcome message
- ✅ Clicking suggested question sends message
- ✅ Clear conversation button resets conversation

---

## Phase 5: User Story 3 - Send Messages and Receive Responses (Priority: P3)

**Goal**: Implement message display, input area, typing indicator, and bot response simulation

**Independent Test**: Can be fully tested by typing a message, sending it, and verifying it appears in the message area with proper styling.

### Implementation for User Story 3

- [X] T021 [P] [US3] Implement ChatbotMessageBubble component in `app/components/chatbot/ChatbotMessageBubble.jsx`
  - User messages: right-aligned, emerald-50 background, rounded-br-sm
  - Bot messages: left-aligned, gray-50 background, rounded-bl-sm
  - Display message content with markdown support using react-markdown
  - Sanitize HTML to prevent XSS attacks
  - Display formatted timestamp (e.g., "10:30 AM")
  - aria-label for accessibility

- [X] T022 [P] [US3] Implement ChatbotTypingIndicator component in `app/components/chatbot/ChatbotTypingIndicator.jsx`
  - 3-dot pulse animation using Framer Motion
  - Gray-400 dots with staggered animation (0.15s delay)
  - Hidden when not visible
  - aria-live="polite" for screen readers

- [X] T023 [P] [US3] Implement ChatbotMessages component in `app/components/chatbot/ChatbotMessages.jsx`
  - Scrollable container with max-h-[400px]
  - Map over messages array to render ChatbotMessageBubble
  - Render ChatbotTypingIndicator when isTyping is true
  - Auto-scroll to bottom using scrollIntoView
  - role="log", aria-live="polite" attributes

- [X] T024 [P] [US3] Implement ChatbotInput component in `app/components/chatbot/ChatbotInput.jsx`
  - Auto-resizing textarea (1-5 rows, min 40px, max 120px)
  - Send button with Send icon
  - Disabled state when input empty
  - Enter to send, Shift+Enter for newline
  - Clear input after send
  - Focus ring for accessibility

- [X] T025 [US3] Update ChatbotWidget to compose all components
  - Import ChatbotMessages, ChatbotInput, ChatbotTypingIndicator
  - Pass messages and isTyping to ChatbotMessages
  - Pass onSend to ChatbotInput
  - Wire up sendMessage to dispatch ADD_MESSAGE and simulate bot response

- [X] T026 [US3] Implement bot response simulation in useChatbot.js
  - Validate message content (not empty, < 2000 chars)
  - Dispatch ADD_MESSAGE for user message
  - Dispatch SET_TYPING(true)
  - setTimeout (1500ms) to simulate bot typing
  - Dispatch ADD_MESSAGE for bot response
  - Dispatch SET_TYPING(false)

- [X] T027 [US3] Add message timestamp formatting utility
  - formatTimestamp function using toLocaleTimeString
  - Hour:numeric, minute:2-digit, hour12:true

- [X] T027a [P] [US3] Install and configure react-markdown for message formatting (FR-020)
  - Install react-markdown package (`npm install react-markdown`)
  - Import in ChatbotMessageBubble component
  - Wrap message content with ReactMarkdown component
  - Verify markdown renders correctly (bold, lists, links)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently
- ✅ All US1 and US2 tests pass
- ✅ Typing message and clicking send adds user message bubble
- ✅ Send button disabled when input empty
- ✅ Typing indicator shows after sending
- ✅ Bot response appears after ~1.5 seconds
- ✅ Auto-scroll to newest message works
- ✅ Timestamps display correctly on all messages

---

## Phase 6: User Story 4 - Navigate Conversation History (Priority: P4)

**Goal**: Ensure smooth scrolling and performance with multiple messages

**Independent Test**: Can be fully tested by having multiple messages and verifying smooth scrolling behavior.

### Implementation for User Story 4

- [X] T028 [US4] Add React.memo to ChatbotMessageBubble component
  - Prevent unnecessary re-renders of existing messages
  - Only re-render when message content changes

- [X] T029 [US4] Add React.memo to ChatbotMessages component
  - Memoize entire message list
  - Dependency on messages array and isTyping

- [X] T030 [US4] Optimize scroll behavior
  - Use useRef for messagesEndRef
  - Implement smooth scroll with scrollIntoView({ behavior: 'smooth' })
  - Debounce scroll triggers if needed

- [X] T031 [US4] Test scroll performance with 50+ messages
  - Add test data generator (temporary)
  - Verify 60fps scroll performance
  - Remove test data after verification

**Checkpoint**: User Story 4 complete - conversation history navigates smoothly

---

## Phase 7: User Story 5 - Use Chatbot on Mobile Devices (Priority: P5)

**Goal**: Ensure full-screen mode and responsive behavior on mobile devices

**Independent Test**: Can be fully tested by viewing the chatbot on mobile screen sizes (≤768px) and verifying full-screen mode activates.

### Implementation for User Story 5

- [X] T032 [P] [US5] Add mobile breakpoint styles in `app/globals.css`
  - Media query @media (max-width: 767px)
  - Override ChatbotWindow position to fixed full-screen
  - Adjust message area max-height for mobile

- [X] T033 [US5] Test responsive behavior at breakpoints
  - Test at 767px (mobile full-screen)
  - Test at 768px (desktop floating)
  - Test at 1024px (desktop)
  - Verify smooth transition between breakpoints

- [X] T034 [US5] Test touch interactions on mobile
  - Tap trigger button
  - Scroll message area
  - Tap suggested questions
  - Verify no UI overflow or clipping

**Checkpoint**: All 5 user stories complete and independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Testing (Optional - Component Unit Tests)

- [ ] T035 [P] Write ChatbotTrigger unit test in `app/components/chatbot/__tests__/ChatbotTrigger.test.jsx`
  - Renders with correct icon
  - Calls onClick when clicked
  - Has correct aria-label

- [ ] T036 [P] Write ChatbotMessageBubble unit test in `app/components/chatbot/__tests__/ChatbotMessageBubble.test.jsx`
  - Renders user message correctly (right-aligned, emerald bg)
  - Renders bot message correctly (left-aligned, gray bg)
  - Formats timestamp correctly

- [ ] T037 [P] Write SuggestedQuestions unit test in `app/components/chatbot/__tests__/SuggestedQuestions.test.jsx`
  - Renders all question chips
  - Calls onSelect when chip clicked

- [ ] T038 [P] Write useChatbot hook test in `app/components/chatbot/__tests__/useChatbot.test.js`
  - OPEN action sets isOpen to true
  - ADD_MESSAGE adds message to array
  - SET_TYPING updates isTyping state
  - sendMessage dispatches correct actions

### Code Quality

- [ ] T039 Run ESLint and fix all issues (`npm run lint`)
- [ ] T040 Verify 'use client' directives on all interactive components
- [ ] T041 Code cleanup and refactoring (remove console.logs, dead code)
- [ ] T042 Verify all components follow checklist format from contracts

### Accessibility Validation

- [ ] T043 Test keyboard navigation (Tab, Enter, ESC)
- [ ] T044 Test screen reader compatibility (NVDA/JAWS or VoiceOver)
- [ ] T045 Verify WCAG AA contrast ratios with color contrast analyzer
- [ ] T046 Test focus management (trap on open, restore on close)

### Performance Validation

- [ ] T047 Run Lighthouse performance audit
- [ ] T048 Verify widget load time < 1 second
- [ ] T049 Verify animation completion ≤ 300ms
- [ ] T050 Verify scroll performance 60fps with 50+ messages

- [ ] T050a [P] Add widget load time performance measurement (SC-003)
  - Use Performance API to measure time from page load to widget interactive
  - Add timing code in ChatbotWidget.jsx useEffect
  - Log "Widget load time: X ms" to console for verification
  - Verify load time < 1000ms (1 second)

- [ ] T050b [P] Add conversation cycle timing measurement (SC-009)
  - Track time from widget open → send message → receive response → close
  - Store startTime in useChatbot hook when isOpen becomes true
  - Log "Conversation cycle time: X ms" when widget closes
  - Verify cycle time < 30000ms (30 seconds)

- [ ] T050c [P] Add user success rate tracking for first message send (SC-002)
  - Track successful first sends vs total attempts in useChatbot
  - Log success rate percentage to console
  - Verify success rate ≥ 95% during testing

### Documentation

- [ ] T051 Update README.md with chatbot widget section
- [ ] T052 Add JSDoc comments to useChatbot hook functions
- [ ] T053 Create component documentation in `app/components/chatbot/README.md`

### Final Validation

- [ ] T054 Run complete manual testing checklist from quickstart.md
- [ ] T055 Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] T056 Cross-device testing (desktop, tablet, mobile)
- [ ] T057 Verify all acceptance criteria from spec.md are met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories**
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

| User Story | Priority | Depends On | Independent Test |
|------------|----------|------------|------------------|
| US1: Access & Open | P1 | Phase 2 | Trigger visible, opens/closes with animation, navigation not blocked |
| US2: Welcome & Suggestions | P2 | Phase 2, US1 (container) | Welcome message + 3 chips display correctly |
| US3: Send & Receive | P3 | Phase 2, US1 (container) | Message sent, typing shown, response received, markdown renders |
| US4: Navigate History | P4 | US3 | Smooth scroll with 50+ messages at 60fps |
| US5: Mobile Responsive | P5 | US1-US3 | Full-screen mode at ≤768px, no clipping |

### Within Each User Story

1. Components marked [P] can be implemented in parallel (different files)
2. Container/integration tasks depend on component completion
3. Story must be complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**:
- T002, T003, T004, T005 can all run in parallel (verification tasks)

**Phase 2 (Foundational)**:
- T006, T007, T008, T009, T010, T011 can all run in parallel (different files)

**Phase 3 (US1)**:
- T012 (Trigger) and T013 (Window) can run in parallel
- T014 (Container) depends on T012, T013
- T015 (Integration) depends on T014
- T016 (Mobile styles) can run parallel with T012-T015

**Phase 4 (US2)**:
- T017 (Header) and T018 (SuggestedQuestions) can run in parallel
- T019, T020 depend on T017, T018

**Phase 5 (US3)**:
- T021, T022, T023, T024 can all run in parallel (different files)
- T025, T026 depend on T021-T024

**Phase 8 (Polish)**:
- All test tasks (T035-T038) can run in parallel
- All validation tasks (T043-T050c) can run in parallel including performance measurements

---

## Parallel Example: User Story 3

```bash
# Launch all US3 component implementations together:
Task: "T021 [P] [US3] Implement ChatbotMessageBubble in app/components/chatbot/ChatbotMessageBubble.jsx"
Task: "T022 [P] [US3] Implement ChatbotTypingIndicator in app/components/chatbot/ChatbotTypingIndicator.jsx"
Task: "T023 [P] [US3] Implement ChatbotMessages in app/components/chatbot/ChatbotMessages.jsx"
Task: "T024 [P] [US3] Implement ChatbotInput in app/components/chatbot/ChatbotInput.jsx"

# After components complete, run integration:
Task: "T025 [US3] Update ChatbotWidget to compose all components"
Task: "T026 [US3] Implement bot response simulation in useChatbot.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. ✅ Complete Phase 1: Setup
2. ✅ Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. ✅ Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Trigger button visible and fixed
   - Opens/closes with animation
   - Mobile responsive
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → **Foundation ready**
2. Add User Story 1 → Test independently → **Deploy/Demo (MVP!)**
3. Add User Story 2 → Test independently → **Deploy/Demo**
4. Add User Story 3 → Test independently → **Deploy/Demo**
5. Add User Story 4 → Test independently → **Deploy/Demo**
6. Add User Story 5 → Test independently → **Deploy/Demo**
7. Complete Phase 8: Polish → **Production ready**

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - **Developer A**: User Story 1 (Trigger + Window + Integration)
   - **Developer B**: User Story 2 (Header + SuggestedQuestions)
   - **Developer C**: User Story 3 (Messages + Input + TypingIndicator)
3. Stories complete and integrate independently
4. Reconvene for Phase 8 (Polish) tasks

---

## Task Summary

| Phase | Description | Task Count |
|-------|-------------|------------|
| Phase 1 | Setup | 5 tasks |
| Phase 2 | Foundational | 6 tasks |
| Phase 3 | User Story 1 (P1) | 6 tasks |
| Phase 4 | User Story 2 (P2) | 4 tasks |
| Phase 5 | User Story 3 (P3) | 8 tasks |
| Phase 6 | User Story 4 (P4) | 4 tasks |
| Phase 7 | User Story 5 (P5) | 3 tasks |
| Phase 8 | Polish & Cross-Cutting | 26 tasks |
| **Total** | **All phases** | **62 tasks** |

### Task Breakdown by Type

- **Setup/Infrastructure**: 11 tasks (Phases 1-2)
- **Component Implementation**: 20 tasks (Phases 3-7) - includes markdown support (FR-020)
- **Integration**: 6 tasks (Phases 3-5) - includes navigation blocking verification (FR-019)
- **Testing (Optional)**: 4 tasks (Phase 8)
- **Code Quality**: 4 tasks (Phase 8)
- **Accessibility**: 4 tasks (Phase 8)
- **Performance**: 7 tasks (Phase 8) - includes SC-002, SC-003, SC-009 measurements
- **Documentation**: 3 tasks (Phase 8)
- **Final Validation**: 4 tasks (Phase 8)

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group of parallel tasks
- Stop at each checkpoint to validate story independently
- All file paths are absolute from project root
- Verify tests fail before implementing (if running tests)
- Mobile-first approach: test mobile styles early and often
