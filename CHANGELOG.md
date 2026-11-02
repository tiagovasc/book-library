# Tiago’s Library — changelog

**2 November 2026, MVP to production pass (not deployed):** applied `Prompts/prompt_app_mvp_to_production.md` (Features, Logic, Engineering, UI/UX polish; desktop and phone). Server: Brotli/gzip, ETag and 304 for page, books.json and covers; hosted page no longer ships the 1.7 MB embedded offline copy; security headers and CSP; save guard against empty or half-deleted libraries; storage timeouts, keep-alive and SIGTERM handling; login failure page instead of raw JSON, failures-only rate limit. Page: cover renditions in `covers/web/` (196.7 MB to 27.2 MB, originals kept as fallback); hidden Restore built-in library on the hosted site; confirm before import replaces the library; load-failure state with Try again; unsaved-edit protection; clearer session-expired and refused-save messages; Back button and `#book/<id>` links for the book drawer; search clear button; back to top; contrast fixes (faint/muted greys, light-header focus rings and accents); fifth table star no longer clipped; visitors no longer see empty editable fields; skeleton loading shelf, pressed states, share metadata. Measured on a throttled phone (staged copy): first book 17.6 s to 2.6 s, visible covers 40.3 s to 4.2 s, repeat visit 17.6 s to 0.6 s. 12 server tests and 38 browser checks pass. books.json unchanged (hash verified). Proposals, rejected ideas, deploy checklist and rollback: `_build/mvp_to_prod_20261102/README.md`. Exact before files and hashes: `_build/mvp_to_prod_20261102/before/`.

**2November2026 — GitHub/sign-in controls:** added the GitHub mark beside appearance/admin controls, linking to the public repository in a new tab. Replaced the password-lock graphic with a sign-in arrow/door icon. Split compact headers into brand/actions and search/layout rows to avoid squeezing the new controls. Labels/tooltips and external-link safety retained; data/authentication unchanged.

**2November2026 — favicon:** reused the existing sage/gold/lavender three-book logo on a dark rounded tile. Added SVG favicon,16/32/48px ICO fallback and180px Apple touch icon; explicitly allowed these asset routes with matching MIME types. No library data changed.

**2November2026 — public repository:** changed tiagovasc/book-library from private to public at the user’s request and linked tiagobooks.com as its homepage. Before publication, scanned all30 commits/76 non-image blobs (about39.6MB), checked actual library credential values plus common secret patterns, verified internal tooling/credential/backup files were excluded and confirmed main was the only remote branch/tag. No credential matches found. Verified anonymous GitHub access; application data/authentication unchanged. Evidence: `_build/public_repo_20261102/audit.json` and `published.json`.

**2November2026 — visible sort/filter state:** added sage active outlines, a sort dot, filter count and removable chips naming the selected sort/filter values. Individual chips reset only their own setting; combined reset preserves the current reading-status tab. Contextual default is date-read newest, or recently acquired for Unread. Verified actual renderer/event handlers for defaults, safe labels/counts, independent resets and Unread behavior. No book data changed. Evidence: `_build/active_controls_20261102/verification.json`.

**2November2026 — light header correction:** user found light mode left the header dark. Removed the historical always-black header palette and forced dark color-scheme; light mode now uses a white header/dark text with matching search/buttons/selects/popovers, while system/explicit dark mode retain the black palette. CSS-only; no book data or JavaScript changed. Updated the former branding rule in PROJECT_GUIDE.md. Evidence: `_build/header_theme_20261102/verification.json`; native browser reconnection was unavailable, so no new visual-verification claim.

**2November2026 — reader-facing header:** removed the management menu from anonymous browsing; moved light/dark switching to a visible sun/moon button and admin login to an adjacent lock icon. Hid Add and internal workflow details for visitors, made ratings/fields read-only and removed edit-triggered login redirects. Admin sessions retain management/import/export/reset/sign-out tools; offline editing unchanged. Simplified acquisition provenance wording for readers. Kept server-side session/revision protection, book data and ratings unchanged. Checked public/admin preview, phone/desktop widths, theme interaction, read-only details,977-record save replay and four isolated server tests. Deployment/visual evidence under `_build/public_ui_20261102/`.

**Custom-domain completion,2November2026:** tiagobooks.com and www both verified live with valid HTTPS certificates and identical977-book/revision38 data. Covers/login load, anonymous saves remain401, native Chrome rendering verified. Set tiagobooks.com as the primary documented public address; retained Railway fallback and unchanged email settings. Certificate ownership TXT records were required in addition to traffic routes; do not assume a CNAME alone completes setup.

**2November2026 — custom domain:** inspected tiagobooks.com in Namecheap and found root/www redirects to an unused Medium blog. User explicitly approved replacement. Bound both hostnames to the existing Railway library, replaced redirects with root ALIAS and www CNAME, and added Railway ownership TXT records; email forwarding/SPF unchanged. No book data moved or reseeded. Setup/rollback: [DOMAIN_SETUP.md](DOMAIN_SETUP.md); actual DNS/certificate/live response outcomes: `_build/domain_20261102/verification.json`.

## 2026-11-02 — Separate first-20 bookshop metadata trial

Applied METADATA_SOP to a frozen first-20 slice of the post-JEV bookshop catalogue, in `_build/metadata_enrichment/bookshop20_20261102/`. User explicitly approved Google Books/Open Library title/author retrieval and JEV candidate metadata/image matching after an initial automatic-approval rejection. Resumable raw pools/model results retained; manual audit recovered a Russell interior page, wrong same-title WWII book and wrong-language Cultura cover, and chose the closer illustrated Jung facsimile.

Separate outputs:16 work matches,14 manually accepted covers,four unresolved matches; two additional matched books lack cover images. Candidate-edition dates16/ISBN13s15/pages11/publisher values13 remain explicitly unverified for photographed copies; two publisher anomalies flagged. Editor/translator roles and original notes preserved; DK corporate credit added to the two DK histories. No personal-library/hosted or source catalogue changes. Existing duplicate95 function run on these20 only:zero flags. Report, CSV/JSON, static review page, exact inputs, provenance/hashes and verification in the trial folder; browser rendering not tested. No Goodreads fallback used.

**Further2November2026 audit:** main-title similarity plus manual full-title/author/actual-cover checks found missed Magee163/165duplicate and Zarkadakis337missing “Own” in title. Original Notion/publisher corroborated Magee; actual cover/official publisher corroborated Zarkadakis. Combined Magee into165keeping September2023/five stars; retained distinct Herzfeld338. Hosted37→38;977books,237unread,955covers/22missing;975 unrelated records exact.25 shortlisted pairs and38 risk-selected records reviewed; no claim of full manual-library clearance. Evidence: `_build/followup_identity_audit_20261102/README.md`.

**Later2November2026 correction — psychiatric title:** user flagged493 again and explicitly identified it as Letheby/Gerrans’s *Philosophical Perspectives on Psychedelic Psychiatry*, combined with unread492. Earlier verification had matched the old Sadler Amazon link, not the intended book. Corrected active title, contributors, cover and description using492; kept7March2026 and personal rating from493, ownership/purchase evidence and both exact originals. Did not transfer the wrong work’s ISBN/year/publisher/pages. Hosted36→37;978books,237unread,956covers/22missing;977 unrelated records exact. Earlier Sadler verdicts/counts below are historical and superseded. Receipt: `_build/psychiatry_confirmation_20261102/applied.json`.

**Latest update, 2 November2026 — clarification audit:** revisited every identification/duplicate/ownership answer in this chat and inspected the associated covers;24 live image hashes matched. The outstanding read-list case was Mysticism428/R.Otto versus Paul Oliver427. After the user explicitly confirmed they are one book, combined them as428, correctly titled/credited to Paul Oliver with the existing verified cover. Preserved read28November2025, personal rating, ownership, purchase evidence, both original records and427 alias. Fresh hosted35→36; current979books,238unread,957covers/22missing;978 unrelated records unchanged. Other definite answers matched; “skip/check later/probably” cases remain distinguished in the [full audit](_build/clarification_audit_20261102/README.md). Prior counts and pending-Mysticism notes below are historical.

Consolidated 1 November 2026 from this entire chat and saved project receipts. Phases below are chronological; the verified implementation checkpoints are dated 1 November. Individual chat messages do not provide separate dates, so no earlier dates or exact times are inferred. This continues an existing library, rather than claiming it was created in this chat.

## Latest verified checkpoint

**980 books; 239 unread; 957 covers / 23 missing; hosted revision 16.** Status totals: 666 read, 239 unread, 58 unknown, 8 paused, 7 next, 2 reading. All unread books are marked owned. JSON, CSV and embedded frontend data agree. Both *The Matter with Things* volumes are unread.

Current rules: [PROJECT_GUIDE.md](PROJECT_GUIDE.md). Earlier counts below describe their own checkpoints, not today’s total.

## 1 November 2026 — chronological changes

### 1. Recover missing covers and make matching economical

- Retried normal catalogue sources, including the configured Google Books connection; used Open Library and publisher evidence as alternatives. The user authorized sending ordinary book titles/authors for lookup. Google Books still produced quota errors in a later purchase pass; a replacement key was not treated as proof that all requests would work.
- Tested JEV using original database/export identity fields plus up to ten catalogue candidates and their images. Avoided researching the answer before inference: the aim was faster, cheaper matching. Kept work identity, image type, cover suitability and confidence signals separate; relative scores are not calibrated probabilities.
- Audited the lowest-confidence 10%, sampled high-confidence selections, then checked the next roughly 20% on request. The fresh 50-book trial exposed two interior pages selected as covers and one valid cover rejected. Added front-cover checks and distinguished missing edition credits from genuine conflicts; a targeted rerun fixed two errors, but did not justify removing manual review.
- Processed all 169 remaining coverless books: **93 covers added; 76 unresolved**. Reviewed the low-confidence sample, higher-confidence picks and exceptions; all applied images had actual inspection or exact prior image-QA evidence. Subsequent recovery added **50**, then confirmed-answer work added **7**, reaching **1,014 covers / 19 missing among 1,033 records** before deduplication.
- Used Goodreads in the native browser as the slower fallback: search → open book → open cover → save/use verified image. Also crosschecked the original Goodreads export to identify vague Notion records; Goodreads was not merely an image source. Saved checkpoints when paused, resumed independently, and deferred genuinely user-dependent questions to question widgets and a physical-library checklist.

Evidence: [enrichment history and verification](_build/metadata_enrichment/README.md), [remaining-input checklist](_build/metadata_enrichment/data/campaign_20261101/recovery76_remaining_input.md). The checklist is historical; later confirmed answers supersede its answered items.

### 2. Correct identities, important bibliography and broken text

- Applied the supplied identifications: Caputo’s *What to Believe?*, Aidan Lyon’s *Psychedelic Experience*, Frank/Gleiser/Thompson’s *The Blind Spot*, James Cooke’s *The Dawn of Mind*, Andy Clark’s *The Experience Machine*, Judith Wolfe’s *The Theological Imagination*, and Ferner/Meyns’s *The Philosophers’ Library*.
- Resolved Peter Enns’s *Exodus for Normal People*, Karen Armstrong’s *Religion: Vintage Minis*, Sharmaine Kwan’s painting book, John Heil’s *What Is Metaphysics?*, the Sadler/Wiggins/Schwartz psychiatric-classification collection, Precision Nutrition’s textbook and the specified Taschen Blake/Dante book. Other biblical titles were research clues, not permission to assign the same author blindly.
- Filled **100 verified blank metadata fields across 75 books**, including 35 author/editor fields; missing authors fell from 49 to 14 at that checkpoint. *The Broken Ring* correctly credits Jean Borella. Preserved author/editor/translator roles and source evidence rather than inferring edition facts from artwork.
- Repaired **100 corrupted string fields**, including the visible Exodus punctuation, using original/source text and publisher evidence. Kept existing records and recoverable before/after values.
- Left ambiguous identities unresolved rather than guessing. Paul Oliver’s *Mysticism* suggestion could not be established by same-month dates; the vague entry remains separate pending evidence.

### 3. Make browsing and editing consistent; publish the library

- Added visible reading dates and a Columns chooser, with consistent table rows and full text in details. Preserved month-only date precision. Investigated Oxford entries against their import/source information rather than assuming ownership or reading status from a cover.
- Presented five date-navigation concepts; implemented the selected Photos-style left rail: vertically centered dot-matrix year, subtler month/count, and month/year navigation within the filtered library.
- Used the user’s existing **personal Goodreads ratings**, correcting the initial Amazon interpretation. Made ratings editable in covers, list, table and details; missing ratings stay unrated.
- Presented three cover treatments before implementation. Applied the selected **option 3: centered edge-to-edge crop**, uniform 2:3 frames without stretching; details retain the complete image.
- Centered the book grid against the header’s logo and view controls. Reserved consistent title, author, date and star bands so differing text lengths do not shift rating rows.
- Reduced scroll work through nearby-card tracking, cached month counts, one lazy batch per animation frame and unchanged-geometry checks. Verified behavior and native scrolling; no measured FPS or universal smoothness claim.
- Published through private GitHub, Railway and the existing shared Supabase project. Public browsing uses simple password-unlocked editing, without account signup. Protected saves with session authentication and revision checks; code deployments do not overwrite hosted data. Kept credentials out of source/docs and verified save replay, field preservation and stale-save rejection.

### 4. Consolidate duplicates across all statuses

- An initial read-only audit had not removed every duplicate; the user’s Harvey and Han examples prompted an all-status cleanup. Manually confirmed **49 groups / 53 extra records: 1,033 → 980**. Preserved complete original objects, aliases, conflicts, sources, ratings, dates and images.
- Adopted the user’s cover preference: choose the best-looking and/or most modern **correct same-work** cover. Artwork does not establish the owned edition.
- Documented current policy, deployment, provenance and recovery in the project guide. Historical counts remain attributable to their checkpoints.

### 5. Sort owned unread books by acquisition

- Made Unread default to newest acquired, following `booksbought.md` top-to-bottom; retained *After Christianity* as newest and the embodied-cognition handbook as the oldest log anchor. Added nine missing purchases: **980 → 989**, with 246 unread and 23 missing covers after five new covers.
- Moved the Filler and Morimoto books near the recent purchases using the user’s approximate-month clarification, explicitly preserving uncertain relative order. Used original Goodreads **Date Added as a labelled proxy**, never a purchase fact, for older matches. At this checkpoint: 114 log-ordered, 2 user-clarified, 92 Goodreads-proxy and 38 unknown-order unread records; unknowns stayed last.
- Added acquisition provenance to exports, columns and details; hid the reading-date rail for relative acquisition order. Left the purchase log unchanged. Confirmed Vinland Saga Omnibus 10/11 as owned after the user answered.

### 6. Add restrained cover feedback

- Added a subtle sage glow/rim, 3px lift and 1.2% enlargement over 240ms. Kept text/stars stationary, quieter list/table feedback, keyboard focus and reduced-motion support. Used CSS only, avoiding pointer-tracking or additional scroll work; deployed and checked native hover behavior.

### 7. Re-audit missed duplicates and reused covers

- Added a reusable **≥95% title OR cover-similarity candidate scan**, without filtering out differing authors/statuses first. Manually reviewed all **79 flagged pairs among 989 records**: combined the Camus typo/author-appended pair, retained 76 distinct pairs and held the generic Bible identity. **989 → 988**.
- Corrected AA100 *Place and Leisure*’s reused *Cultural Encounters* image. These are distinct books, not duplicates; an ISBN lookup also returned the wrong image, so actual cover text and retailer evidence determined the correction.
- Broadened the search and triple-checked a further **20-pair shortlist** against full metadata/history, actual cover text and original records/catalogues. Combined Escher and Lyotard imports; corrected Oxford *Phaedrus*’s erroneous *Phaedo* cover. **988 → 986**. Algorithms generate leads only; reviewed fingerprints and verdicts support later rescans, not a claim that no possible duplicate remains.

Evidence: [initial cleanup](_build/hosted_library_20261101/DEDUPLICATION_REPORT.md), [95% audit](_build/hosted_library_20261101/DUPLICATE95_REPORT.md), [triple-check audit](_build/hosted_library_20261101/TRIPLECHECK_REPORT.md).

### 8. Apply final answers and clarify the edition rule

- Combined Banich, Plato’s *Phaedrus*, Augustine’s *Confessions*, the saints encyclopedia and *Tao Te Ching*: **986 → 980**. The user clarified that same book/same author normally combines across editions/translations unless strong evidence or an explicit choice requires otherwise; they are not tracking rereads of different editions.
- Kept *The Matter with Things* as **two volume entries**, removed the redundant whole-work card, then explicitly confirmed both volumes **unread**. Archived the aggregate read date/rating as superseded history on both volumes; did not invent volume completions or copy the aggregate rating into current ratings.
- Verified revisions **14 → 15 → 16**, exact preservation of 973 unrelated records and JSON/CSV/frontend agreement. These later answers supersede the earlier five pending edition/set cases.

## Remaining work and standing verification

**Documentation follow-up, 1 November 2026:** added [METADATA_SOP.md](METADATA_SOP.md) for future agents: source/export matching, catalogue/JEV inputs, frozen confidence sampling, native Goodreads fallback, field-specific evidence, duplicate triple-checking, safe apply/readback/recovery, and a problem→solution table. Linked it from the guide, README and enrichment history. Documentation only; library data unchanged.

There are **23 missing covers** at the latest checkpoint. Identity/physical-library checks remain for genuinely vague entries, including the generic Bible, uncertain Mysticism, author-only Han/Pessoa/Hearn entries, Prayer Book, World Religions, Nietzsche volume, “What’s the difference?” and the uncertain Oxford ethics handbook. Do not re-ask already answered cases; consult the latest receipts before the older checklist. Unknown acquisition order remains explicitly unknown rather than fabricated.

For future enrichment, supply raw source metadata to JEV, audit the lowest-confidence 10% plus high-confidence samples and exceptions, and reject interior pages/wrong works. For duplicates, algorithms only shortlist; manually triple-check before merging. Preserve originals and exact deltas, fetch fresh hosted state, compare revisions and verify exports/readback. This documentation consolidation changes no books or ratings.

## 2 November 2026 — mobile browsing

Expanded phone shelves to full width; two cover columns (three on wider phones/small tablets). Kept browsing controls reachable after scrolling, enlarged touch controls and used16px form text to avoid small-input focus zoom. Moved phone date navigation into a compact bottom dock with a native month picker; fixed double-offset month jumps. Contained popovers/table scrolling and made details full-height with44px navigation. Preserved desktop layout, cover treatment, ratings and book data. Checked320/390/540/760/1280px widths, search, list/table, filters, December2025 navigation and details; no page-wide horizontal overflow. JavaScript and980-record field-preservation replay pass. Evidence: `_build/mobile_20261102/verification.json`; physical-device verification remains outside this browser-width audit.


**Completed 2 November 2026 — records 71–170:** 100 records processed; 77 catalogue matches, 66 accepted cover attachments, 23 unresolved identities and 11 additional cover gaps. All 65 JEV-selected actual images were inspected; two wrong-language choices were corrected using existing/cached evidence and another language conflict held unresolved. All five duplicate-image pairs represent the same work in separate photos; none merged. Source CSV and all original records unchanged. Edition details remain catalogue evidence, not verified photographed editions. No personal-library/hosted changes. Next unprocessed record:171. Starting weekly meter21% (user report); ending meter unavailable.

Campaign: `Meaning/Books/Dashboard/_build/metadata_enrichment/bookshop_next100_20261102/README.md`. Across all three passes:170 records processed,142 catalogue matches,122 accepted cover attachments,28 unresolved identities.


## 2 November 2026: all 819 bookshop metadata records processed

Completed the remaining 649 post-JEV single-book records (171-819): **550 catalogue matches, 478 accepted covers, 99 unresolved matches and 72 other cover gaps**. All 649 catalogue/JEV calls finished before corrections. One bounded retrieval pass; no repeated recovery searches.

Across all four campaigns: **819 processed, 692 catalogue matches, 600 accepted covers, 127 unresolved matches and 92 metadata-only cover gaps**. These are photo records, including repeat photos of the same book; they are not a count of unique works.

[Search all records](../Bookshop trips/Book-metadata.html) | [Complete CSV](../Bookshop trips/books-metadata.csv) | [Complete JSON](../Bookshop trips/books-metadata.json) | [127 unresolved matches](../Bookshop trips/metadata-needs-research.csv) | [92 cover gaps](../Bookshop trips/metadata-cover-gaps.csv) | [Campaign evidence](_build/metadata_enrichment/bookshop_remaining_20261102/README.md).

All 475 JEV-selected actual images in the remaining campaign were visually inspected, plus 26 none-case image assets and seven alternative assets. Wrong-language, wrong-volume, audiobook, interior-page and placeholder assets were held or replaced using existing evidence. Six incompatible Open Library edition-detail responses were excluded from accepted bibliography; raw receipts remain. All 600 final cover hashes and image decodes, original-row equality, 819 unique photo IDs and report links passed verification. Sixty-six duplicate-similarity pairs were reviewed; separate photo records remain intact. Catalogue editions and cover artwork do not establish the exact edition photographed. Original source CSV unchanged; no personal-library or hosted changes.

This completion supersedes earlier metadata in-progress/next-record notices without removing their history. **No unprocessed single-book rows remain in the frozen 819-row source.** Continue only from the explicit unresolved/cover-gap lists, with fresh authorization for further external research. Original extraction uncertainties (including the 23 extra extraction checks) remain separate and are not claimed resolved by catalogue enrichment. User reported weekly usage still 21% at campaign start; ending meter unavailable, no usage delta inferred.
