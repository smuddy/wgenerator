# Project Map
_Generated: 2026-05-14 17:20 | Git-backed | Custom location requested by user_

## Directory Structure
src/app/modules/songs/ - song list, editing, display, key and transpose services.
src/app/modules/shows/ - show list and show-song workflow.
src/app/services/ - shared app services including filter state and search helpers.
src/app/widget-modules/ - shared UI components and pipes.

## Key Files
src/app/modules/songs/song-list/filter/filter.component.* - sidebar filters for the song list.
src/app/modules/songs/song-list/song-list.component.* - song list view model and filter application.
src/app/modules/songs/services/key.helper.ts - canonical key lists, display mapping, and scale selection.
src/app/services/filter-store.service.ts - in-memory filter state for songs and shows.
src/app/services/filter.helper.ts - text search scoring and filtering helpers.

## Critical Constraints
- Memory markdown files are kept in `.dev/` by user request, not project root.
- Song key data stores major keys uppercase and minor keys lowercase.
- German notation uses `H`; `B` represents B-flat in flat spellings.

## Hot Files
src/app/modules/songs/song-list/filter/filter.component.ts, src/app/modules/songs/song-list/filter/filter.component.html, src/app/modules/songs/services/key.helper.ts
