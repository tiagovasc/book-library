# TBR catalogue

Added 2 November 2026. Public route: `/?collection=tbr&source=bookshops`.

The header switches between Library and TBR. TBR has **Instagram**, **Book shops** and **Online** sources; only Book shops is populated. The other two deliberately show empty states. “Online” is the public label for the future Amazon import.

Book shops contains **753 entries from 819 book-photo records**. Default order is the newest original photo first, starting at Watkins Books, City of Westminster, 29 October 2026. Cards and visit headings show city, shop and local photo date. Search includes title, credited creator and places. City/shop filters include historical sightings; when filtered, the card uses the newest matching sighting. Details always retain the complete visit history. Covers/list/table, title/author/oldest sorting, 48-book batches, mobile source selection and empty/error/retry states are supported.

## Source and publication boundary

- Canonical evidence remains `../Bookshop trips/books-metadata.json`, `grouped-visits.json`, `visit-index.json` and `shop-identifications.json`. No source file was modified for this import.
- `tbr-bookshops.json` is a **derived public catalogue**, separate from `books.json` and Supabase's personal library row. Browsing TBR never changes ownership, read status, ratings or the library revision. TBR is currently read-only, including for admins; edit its owning source and regenerate deliberately.
- `tbr.js` and `tbr.css` implement the separate catalogue. The server allowlists and compresses these three files; Docker must copy them. Publish the listed `covers/web/tbr_bookshop_*.jpg` renditions too.
- Public data contains work identity, catalogue description, cover path and visit city/shop/date/status. It excludes original photo files, source filenames, GPS, EXIF, local paths and internal research evidence.
- Unknown/probable shop identities remain explicitly uncertain. Covers/descriptions are catalogue-work matches; they do **not** certify the edition photographed. Missing authors are not invented. Role-verified editors are labelled as editors.

## Import and verification, 2 November 2026

The import matched each book record to its exact trip/photo timestamp rather than substituting visit end dates. All 819 records are retained as sightings. Fifty-six exact normalized full-title/author repeat groups were manually checked against six cover contact sheets. Most were consolidated; *The Book of Enoch* record506 remains separate from809/812 because blank authors and conflicting scope/translator evidence do not establish a safe match. No fuzzy algorithm merged books automatically. Future cross-source imports must retain all source memberships and review candidates before merging.

There are **725 entries with covers**, **28 without**, and **one unresolved identity** (*Michelangelo*). Missing covers have placeholders; the unresolved entry remains visible and marked. There are719 distinct optimized public cover files. Source fingerprints, exact groups, review sheets, import script/report and regression harness are retained privately under `_build/tbr_bookshops_20261102/`. That importer is a frozen, source-hash-guarded one-off, not an automatic campaign restarter.

`npm test` includes data reconciliation, historical-sighting search/filter behavior, unchanged-source checks, chronological order, asset presence and read-only/compressed/conditional HTTP routes, alongside existing library/auth/save tests. A separate DOM harness exercises public/admin switching, direct TBR URLs, pagination, details, search isolation, filters, layouts, empty tabs and absence of writes. These interaction checks do not establish visual rendering quality; no new native-browser visual check was performed for this release.

## Future work

Import Instagram and Online only when requested, from the source projects linked in `../TBR list.md`. Preserve interests separately from purchases and completed reads. Reconcile works against existing TBR sources rather than duplicating them, retain source memberships and dates, and repeat manual review of ambiguous matches. Do not run old personal-library seed/merge scripts to import TBR.

Rollback: revert the TBR release commit and redeploy. The personal-library database needs no rollback because this feature does not write to it.
