Improvement suggestions
A. Code Quality & Architecture
Enforce the 200-line/component limit by splitting very large files (e.g. PostCard.component.tsx is ~375 lines). Extract sub-components:
PostHeader, PostBody, ImageCarousel, PostActions, ReactionSummary, ReactionPicker.
Consolidate duplicated “close on outside click” logic (menu, modals) into a small reusable hook.
Define shared types for ReactionType, PostFilter, CommentVisibility, etc., and centralize them in /src/types.
B. Performance & UX
Debounce search input (e.g. 300 ms) so you don’t refetch on every keystroke.
Replace the window.scroll listener with an IntersectionObserver on a “load more” sentinel—more efficient and less error-prone.
Add skeleton loaders or shimmer placeholders instead of “Loading…” text.
Show an empty-state UI when no posts match the current filters.
Use Next.js’s <Link> for navigation and <Image> for optimized image loading (configure remote domains).
Revoke object-URLs (from URL.createObjectURL) in <CreatePost> when images are removed to avoid memory leaks.
Optimize the reaction picker so that a fast click doesn’t briefly flash the full picker.
C. Accessibility
Ensure all buttons, modals, and pickers have appropriate ARIA roles/labels and keyboard support (ESC to close, arrow keys in carousels and pickers).
Make the “Read more” toggle and image carousel controls focusable.
Add alt text to all images (the carousel and comment attachments).
D. Feature Enhancements
Add real-time updates (e.g. WebSockets or Supabase Realtime) so new posts/comments/reactions appear without a full refetch.
Support nested threading beyond one level (or collapse deeper threads under a “View full thread” link).
Offer “Edit draft” state on the CreatePost page if a draft exists in localStorage.
Provide optimistic updates for reactions and comments so the UI feels snappy.
Allow filtering posts by date range or “My posts.”
Enhance the share dialog with social-media previews (Open Graph) and copy-link feedback.
Add moderation tools: flag post/comment, block user, etc.
E. Testing & Documentation
Write unit tests for key components (carousel, reaction picker, comment form) using React Testing Library.
Add E2E tests (Cypress) for the full “create → view → react → comment” flow.
Update progress.md with a clear map of what’s done and what’s next in your feed feature.
By tackling these areas you’ll improve maintainability, performance, accessibility, and user experience—while staying true to your project’s mobile-first, component-driven guidelines.


# Improvement suggestions & Action Plan

## A. Code Quality & Architecture
- [x] Split `PostCard.component.tsx` (~375 lines) into focused sub-components:
      - PostHeader, PostBody, ImageCarousel, PostActions, ReactionPicker
- [x] Extract duplicated “close on outside click” logic into a reusable `useOutsideClick` hook
- [x] Define and centralize shared types (`ReactionType`, `PostFilter`, `Comment`, etc.) in `/src/types`

## B. Performance & UX
- [x] Debounce search input (300 ms) to avoid excessive refetches
- [x] Replace the global `window.scroll` listener with an `IntersectionObserver` sentinel
- [x] Add skeleton/shimmer placeholders for loading states instead of plain “Loading…”
- [x] Design and display an empty-state UI when no posts match current filters
- [x] Migrate all navigation to Next.js `<Link>` and images to `<Image>` (configure remote domains)
- [x] Revoke object-URLs in `CreatePost.component.tsx` when removing images to prevent memory leaks
- [x] Tweak the reaction picker so a fast click doesn’t briefly flash the full picker UI

## C. Accessibility
- [ ] Add proper ARIA roles/labels and keyboard support (ESC to close, arrow navigation in pickers and carousel)
- [ ] Make the “Read more” toggle and carousel controls focusable
- [ ] Ensure every image (carousel slides, comment attachments) has meaningful `alt` text

## D. Feature Enhancements
- [ ] Implement real-time updates via Supabase Realtime or WebSockets (new posts/comments/reactions)
- [ ] Support multi-level nested threads or provide a “View full thread” collapse for deep replies
- [ ] Show an “Edit draft” state on the CreatePost page if a localStorage draft exists
- [ ] Add optimistic updates for reactions and comments to make the UI snappier
- [ ] Introduce new filters: date-range picker and “My posts”
- [ ] Enhance the share dialog with social-media previews (Open Graph) and copy-link feedback
- [ ] Build moderation tools: flag post/comment, block user, etc.

## E. Testing & Documentation
- [ ] Write unit tests (React Testing Library) for key components: carousel, reaction picker, comment form
- [ ] Add end-to-end tests (Cypress) covering the full “create → view → react → comment” flow
- [ ] Update `progress.md` with current status after each completed item