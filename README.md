# wgenerator

## Admin migration

If `songUsage` needs to be rebuilt from all existing shows, log in with a user that has the `admin` role and run this in the browser console:

```js
await window.wgeneratorAdmin.rebuildSongUsage()
```

If the `songIds` index on shows needs to be backfilled for tooltip usage in song details, run:

```js
await window.wgeneratorAdmin.rebuildShowSongIds()
```

The command logs progress in the browser console while it runs and prints the final summary when finished.

The migration:

- resets `songUsage` for all users
- scans all shows and all `shows/{id}/songs` entries
- rebuilds the per-user counters based on show ownership

It returns a summary object with processed user, show and show-song counts.

The show index migration:

- scans all shows and all `shows/{id}/songs` entries
- writes the distinct `songIds` array to each show document

It returns a summary object with processed show and show-song counts.

This is intended as a manual one-off migration and is read-heavy by design.
