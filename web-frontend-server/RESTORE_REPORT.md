# MiniHome source restoration

Restored the latest Codex source state, following the round blue avatar and ID formatting change. Reconstructed from an earlier checkpoint and recorded edit commands; excluded subsequent layout changes and expanded blog data.

## Recovery archives

- `.backups/minihome-before-restore.zip`: source before this recovery.
- `.backups/minihome-last-good.zip`: restored source, assets, tests and project configuration.

## Validation

- TypeScript and production build passed in staging and again in the restored workspace.
- ESLint passed in staging and again in the restored workspace.
- Chrome: four main routes rendered without page errors.
- No horizontal overflow at 768/390px, including register.
- Rooms: budget filter and hide/reopen sidebar preserved selections.
- Home: eight featured rooms, two for the loft filter, quiz opened.
- Students: 30 mock records, 10 per page, page 2 started at 11; name search returned one match.

Infrastructure, API contracts and environment settings were not changed.

## Restored files

- `src/App.css`
- `src/index.css`
- `src/app/layout/AppLayout.tsx`
- `src/app/providers/AppProviders.tsx`
- `src/features/home/components/FeaturedRoomRail.tsx`
- `src/features/home/components/CategoryIcon.tsx`
- `src/features/home/pages/HomePage.tsx`
- `src/features/auth/pages/AuthPage.tsx`
- `src/features/auth/services/auth.service.ts`
- `src/features/blog/components/BlogCard.tsx`
- `src/features/blog/data/posts.ts`
- `src/features/blog/pages/BlogPage.tsx`
- `src/features/students/components/StudentStatArtwork.tsx`
- `src/features/students/data/students.mock.ts`
- `src/features/students/pages/StudentsPage.tsx`
- `src/features/rooms/data/rooms.mock.ts`
- `src/features/rooms/pages/RoomsPage.tsx`
- `src/features/rooms/pages/RoomDetailPage.tsx`
- `src/shared/styles/motion.css`
- `src/shared/components/VisualEffects.tsx`
- `public/minihome.svg`
- `tests/app.spec.ts`
