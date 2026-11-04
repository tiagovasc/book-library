# Contributing

Keep changes focused and describe the reader-facing behavior they improve. Run `npm test` before submitting a change. For interface changes, check narrow and wide layouts, both themes and keyboard navigation.

Use your own Supabase project and credentials for development. The automated tests use mock storage and do not require production access. Never commit credentials, session secrets, personal exports or database snapshots.

This repository contains the application, public catalogue assets and developer documentation. Research notes, metadata-collection workflows, operational account records, review decisions and campaign reports are maintained separately. The publication-boundary test checks the tracked file list and prevents embedded library snapshots from being introduced.

When changing data formats, preserve book IDs, ratings and reading history. Keep catalogue identity, image selection and edition-specific facts distinct. Covers and descriptions may carry third-party rights; do not assume that the application source grants rights to those assets.
