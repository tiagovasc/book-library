# SOP — missing book metadata and covers

**Quality-replacement lesson,3November2026:** publisher images and Open Library large ISBN fronts upgraded all six saved scores below40; Italian Metafora required a library-hosted image. Google returned the identical generic “image not available” JPEG for two unrelated books, despite its76/100 technical-quality score. Inspect the actual cover and reject placeholders regardless of sharpness score. Use new asset URLs to avoid day-long cover caches, publish assets before changing live references, and compare all non-cover fields against fresh revision-guarded state. Apply `cover-overrides.json` when rebuilding TBR so immutable raw enrichment evidence cannot regress verified replacements.

**Cover-quality screening,2November2026:** use [COVER_QUALITY_REVIEW.md](COVER_QUALITY_REVIEW.md) and `_build/cover_quality_20261102/README.md` for the separate read-only image-quality audit. Every existing image is scored1–100 (higher better), including separate resolution/sharpness scores, image hash and all referring book IDs. The user explicitly requested a continuous ranking rather than choosing a cutoff now. Preserve all scores; any diagnostic bands are explanatory, not replacement authorization. Use original pixel dimensions and normalized edge/detail measurements, not DPI tags or a sole Laplacian threshold. Select the review score range with Tiago later, manually inspect, then research replacements. Retain originals, decisions and per-image evidence; the audit does not verify book identity/edition and must not automatically replace covers.

**Publication boundary,2November2026:** the curated `tiagovasc/book-library` repository is now public. Earlier “private release” wording below is historical. Keep the same curated checkout, exclude credentials/internal tooling/backups, and inspect staged changes before each push. Internal `_build/` evidence stays local; do not publish it to satisfy a documentation link.

**Bookshop first-20 trial,2November2026:** [_build/metadata_enrichment/bookshop20_20261102/REPORT.md](_build/metadata_enrichment/bookshop20_20261102/REPORT.md) records a separate post-JEV pilot:16 catalogue matches,14 manually accepted covers. Manual inspection rejected an interior Russell title page, a different same-title WWII book and a Spanish cover for Portuguese Cultura; a Reader's Edition was replaced by the closer Jung facsimile. Preserve available original public editor/imprint evidence in references for generic titles; a blank author alone can leave different same-title books indistinguishable. Treat catalogue publisher anomalies and zero page counts as unresolved, and keep catalogue-edition facts separate from photographed copies. No personal-library updates were made.

**Additional duplicate guard,2November2026:** supplement full-title similarity with main-title-before-subtitle comparisons so “Confession of a Philosopher” can surface beside the much longer “Confessions of a Philosopher: …”. This produces false positives for generic titles/series: manually review complete subtitles, authors and images before any merge. Actual cover text can expose a missing title word (Zarkadakis *In Our Own Image*); it does not justify combining a different author's similarly named book.

**Lesson from the2November2026 psychiatric-title correction:** matching an older supplied link proves what that link identifies, not necessarily the user’s intended reading entry. The user explicitly corrected493 to Letheby/Gerrans’s *Philosophical Perspectives on Psychedelic Psychiatry* and confirmed merging492. When changing to a different work, do not fill the corrected record’s blank ISBN/year/pages/publisher from the rejected work. Preserve those facts only in the exact original archive. This supersedes the historical Sadler identification example below.

**Clarification follow-up, 2 November2026:** the user subsequently explicitly confirmed that Mysticism428 and Paul Oliver427 are one book. They are now combined as428, read28November2025. The conditional-date example below is historical, not an open question. Consult the [answer-by-answer audit](_build/clarification_audit_20261102/README.md) before re-asking any previous clarification.

Updated 1 November 2026. For future agents maintaining Tiago’s Library. This is the operating procedure; [CHANGELOG.md](CHANGELOG.md) explains its history, [PROJECT_GUIDE.md](PROJECT_GUIDE.md) holds current project policy, and the [enrichment campaign guide](_build/metadata_enrichment/README.md) maps scripts and receipts. Historical script examples/counts are not authorization to replay old transactions.

## 1. Establish current scope before research

1. Read workspace `CLAUDE.md`, applicable local instructions and the project guide. Follow current user clarifications over older project notes. The user explicitly requested question widgets for genuine remaining ambiguities, after independent work is complete.
2. For the hosted library, obtain a fresh authenticated-authorized snapshot and its revision using the existing release tooling. Online Supabase state is authoritative. Local `books.json` is a snapshot; CSV and the embedded `SEED` are derived exports. Never treat an old fallback seed as current hosted data.
3. Enumerate missing fields by record ID and distinguish blank from deliberately unknown, collective/unattributed authorship, source gaps and pending identity. Check existing provenance, aliases, prior decisions and the user’s answered questions first. Do not ask the same question again.
4. Freeze an exact input scope: snapshot/hash, revision, target IDs, allowed fields and counts. Preserve and hash-check immediate-input backups before bulk changes; read the critical-files appendix. Record a dated campaign directory under `_build/metadata_enrichment/`, not at workspace root.
5. Prioritize identity and author/editor, then cover, publication details and useful description. An absent ISBN or page count is not a reason to guess an owned edition. Keep research, model selection, approval and application as separate stages.

Checkpoint example only: revision16 had 980 books and 23 missing covers. Always recalculate; do not hard-code these counts into a new run.

## 2. Resolve identity from existing sources first

- Start with the actual database/export title, subtitle, author/contributors, year, ISBN, publisher, language, format, pages, subject and description when present. Preserve original spellings alongside supported corrections.
- Crosscheck vague Notion entries against the original Goodreads export/workbook and purchase log. Match using supported title/author/ISBN and source links, not row proximity alone. Reading dates can corroborate identity but cannot establish it on their own; month-only dates must stay month-only.
- Goodreads is an identity source as well as a cover source. An existing book ID/source row is stronger than guessing from a vague label. Search catalogues before asking the user; author-only entries or several plausible works may still require physical-library checking.
- Existing confirmations remain authoritative: for example, John Heil’s *What Is Metaphysics?* is not Heidegger’s; *Psychedelic Experience—Revealing the Mind* is Aidan Lyon’s, not Timothy Leary’s. Do not replace a confirmed identity with the first popular search result.
- Keep uncertain suggestions uncertain. “Probably Paul Oliver” did not resolve *Mysticism: An Introduction*: the available dates did not establish the requested same-month match. “Probably Kallistos” also does not establish an exact Prayer Book.

## 3. Retrieve candidates through normal sources

1. Try the configured Google Books service (`_build/google_books_service.py`; verify its current location/configuration before use). Test one representative lookup with the configured key without printing it. Distinguish quota/rate limits, authentication failure, empty results and transport failures. A new key is not proof of success.
2. Use Open Library, publisher pages and reliable catalogues as alternatives. Try exact ISBN when supported, then title+author searches. Ordinary title/author lookups were explicitly authorized in this chat; send only task-relevant information, never private notes, credentials or personal reading history.
3. Retain up to ten plausible normal-source candidates in original source order, including actual image bytes where available. Save source IDs/URLs, retrieved metadata, timestamps and image hashes. Missing images, empty pools and provider errors are distinct outcomes, not model rejections.
4. Cache identical requests and images, rate-limit/retry transient failures with bounded backoff, and resume incomplete IDs only. Stop repetitive quota-failed calls and use alternatives. Never bypass certificate validation to make a source work.

## 4. Let JEV select without doing its work beforehand

Give the available multimodal matcher two clearly separated inputs:

- **Reference:** original database/export identity fields from step2. Exclude private notes, personal ratings/history, manual verdicts, answer labels and newly researched “correct answer” packets.
- **Candidates:** up to ten uncurated catalogue options, each with stable ID, metadata, actual image or an explicit missing-image marker, and provenance. Do not cherry-pick only the answer after manual research.

Request a structured decision: selected candidate ID **or none**, work/author/volume compatibility, actual image type, genuine-front-cover estimate, cover-match estimate, uncertainty/conflicts and a brief evidence-based reason. Keep translator/language/volume conflicts explicit. Missing translator credit is unknown, not automatically a contradiction. Sparse typographic front covers are valid; interior pages remain invalid even when their text matches perfectly.

For continuity with the tested production flow, rank chosen images by the minimum of identity, genuine-front and cover-match estimates. For none, retain one minus the maximum candidate cover-match estimate as its review-ranking signal. Store relative candidate scores, API confidence and margins separately. A 1–100 score, normalized candidate share or large winning margin is **not a calibrated probability of correctness**. Do not force a choice or fabricate a model result for an empty pool.

If the multimodal service is unavailable, record that limitation and use ordinary source/manual verification; do not claim a model reviewed an image it never received. Read the applicable skill only when actually using its tools.

## 5. Freeze the manual audit before inspecting answers

1. Freeze ranking and sampling rules. Review the lowest-confidence **10%, rounded up**, plus five seeded higher-confidence actual picks where enough exist. Include some higher-confidence none decisions so false rejections can be detected. State whether the denominator is scored decisions or all targets; list unscored failures separately.
2. Add mandatory exceptions: non-front/uncertain image types, conflicting identity, low-quality images, known bad image hashes, unsupported choices, provider failures and newly changed reference evidence. Reuse past visual QA only for the exact image hash with compatible reference identity.
3. Inspect actual images at readable size, not just URLs or model explanations. Check full title/subtitle, author/editor, language, volume/issue, front-cover layout and source consistency. Record accept, replacement, reject or unresolved with a reason and inspected image hash.
4. Expand review if errors appear. The original fresh50 audit found two interior-page false positives and one suitable-cover false negative in the lowest five. The next ten ranked cases were checked on request; all ten were suitable. This stratified audit did not establish whole-batch accuracy. A revised guard fixed two known errors but still missed one; prompt changes do not replace inspection.
5. A sample audit does not make every item manually verified. Report sampled, automated, individually inspected and exact-prior-QA outcomes separately. In the historical production run, all93 applied images ultimately had human/exact-prior-QA evidence; future runs must report their actual coverage.

## 6. Recover unresolved cases; use Goodreads last for new images

Finish normal-source work first. For unresolved identity, use source-export crosschecks and publisher/catalogue evidence. For new Goodreads fallback work, use the supported **native browser**:

1. Search Goodreads for the book with author where known.
2. Open the correct book page, inspect identity, click the book cover and save/use the actual verified image.
3. Record book/source URL, image provenance/hash and verification verdict. Preserve original files. Do not replace this requested flow with direct Goodreads scraping or replay already completed browser work without a concrete need.

If the page fails, the search card or an alternative publisher/retailer may help, but verify the actual full image. Otherwise leave unresolved with its failure reason. Prefer the most attractive/modern correct same-work front cover, then image quality; exact owned-edition artwork is not required. This never permits a different work, language/volume mismatch, interior page, portrait, banner or placeholder.

After independent research, collect only genuinely user-dependent cases into question widgets. Maintain a saved check-later list with record ID, original data, attempted sources, alternatives and precisely what the user must check. Respect “skip/check later”; do not repeatedly ask or block other work.

## 7. Approve bibliography separately from cover art

- A correct same-work cover does **not** verify its edition’s ISBN, year, publisher or page count for the owned copy. Require exact edition evidence for those fields, including ISBN10/13 equivalence and compatible full title/author. An ISBN lookup can itself be wrong; hold conflicts.
- Distinguish author, editor, translator, compiler and coauthor. Do not invent individual authors for Bibles, serial bundles or unattributed collective publications. A recurring verified coauthor credit, as with Precision Nutrition, does not establish sole/lead authorship or a particular textbook edition.
- Fill only explicitly approved blank fields by default. Supported corrections to existing values require their own exact OLD/NEW proposals and provenance. Keep source variants and uncertainty; never overwrite curated values with generic catalogue text.
- Repair mojibake from original/publisher evidence. Avoid blind whole-database re-encoding or broad replacements: already correct Unicode can be damaged. Verify exact corrected strings and unaffected fields.

## 8. Check duplicates and wrong cover reuse before applying

Run the existing `duplicate95_audit.py` workflow on fresh state, following the [audit report](_build/hosted_library_20261101/DUPLICATE95_REPORT.md). Flag ≥95% normalized full-title **or** author-stripped-title similarity, perceptual dHash or resized RGB pixel similarity. Do not pre-exclude differing authors, numbers or statuses. Algorithms only produce a shortlist.

Triple-check every proposed merge: **(1)** full metadata/identifiers/scope/history, **(2)** actual cover text/images, **(3)** original records or reliable catalogue evidence. Save the verdict and reference/image fingerprints; changed evidence requires renewed review. Broaden title/identifier searches when a strict threshold misses likely pairs.

Same book/same author normally combines for this user even across editions/translations, unless strong evidence or an explicit user choice requires otherwise. Distinct volumes/issues/works stay separate. Preserve originals, aliases, conflicts and personal ratings/history. A set’s completion/rating does not automatically belong to each component; the user explicitly requires two **unread** *Matter with Things* volumes, with old whole-work data archived as superseded history.

## Problems encountered → required response

| Problem | Resolution / guard |
|---|---|
| Google Books new key still encounters quota errors | Test actual response; log error category, back off and fall back. Never announce success based on key presence. |
| Interior title page accepted; valid minimalist cover rejected | Separate identity from image type; inspect front layout, retain sparse valid covers, audit low-confidence and none cases. |
| Too much manual curation before JEV | Use raw source reference plus normal candidate pools; research unresolved cases afterward. |
| ISBN lookup supplies another book’s image | Verify actual cover text. AA100 Book4 needed its green *Place and Leisure* cover; Book3 remained a distinct book. |
| Wrong near-title cover | Oxford *Phaedrus* had *Phaedo* art; compare the complete visible title, not author alone. |
| Retrieved preface, portrait, social banner or wrong issue | Reject by actual image type/scope; use verified publisher front. Preserve the rejected evidence. |
| Typo/author appended hides duplicate | Compare full and author-stripped normalized titles; manually assess Camus-style variants. |
| Same series/white background triggers ≥95% | Treat score as a lead, never identity proof; preserve distinct volumes and books. |
| Different art/translation causes duplicate cards to survive | Apply the user’s same-work rule after triple-checking; retain edition conflicts/history rather than extra cards by default. |
| Stale manifest hash or concurrent edit | Stop the apply, compare fresh inputs and regenerate the reviewed proposal. Never disable hash/revision checks. |
| Deployment reintroduces old data | Deploy code separately; never reseed an existing hosted row from local fallback data. |
| Acquisition/date confusion | Goodreads Date Added is only an acquisition proxy; publication, purchase and reading dates remain separate. |

## 9. Apply, independently verify, publish and hand off

1. Produce an explicit accepted manifest with target IDs, allowed fields, source hashes, exact OLD field presence/value and proposed NEW. Dry-run first. Reuse tested script patterns only after checking their scope and safety. **Do not rerun** frozen169/recovery76 stagers or already-applied acquisition/dedup/identity scripts against today’s library.
2. Immediately before writing, fetch fresh hosted state and verify revision/input hashes. If changed, rebase proposals onto current records and revalidate. Use authenticated compare-and-save; stale writes must fail. Never overwrite intervening personal edits.
3. For cover-only work, change only approved cover/status fields. For metadata work, enforce a field whitelist. Preserve every unrelated field, ID/order and original image. For confirmed duplicate consolidation, retain complete verbatim originals, removed-ID aliases and conflicts. Roll back by exact delta only if the current value still equals the recorded NEW value.
4. Independently reopen final JSON, CSV and parsed HTML `SEED`; reconcile count/status/cover deltas, field presence and unrelated-value equality. Hash/decode every new image and check references exist. Preserve HTML outside the intended seed replacement; never dump or broadly rewrite its huge single-line seed.
5. Read back hosted state exactly, check persistence and open representative live frontend records in the native browser. Verify actual images and visible text. Use isolated/no-op save tests; do not alter real ratings just to test. Distinguish image-file verification from live visual verification if the browser is blocked.
6. Publish approved frontend/covers/docs through the curated private release checkout, not the outer workspace repository. Keep credentials, internal research and backups out. Verify Git publication and, when claiming deployment, actual Railway outcome/live assets separately. Do not reseed data during a UI/docs release.
7. Update project guide, changelog and campaign report with date, counts, actual QA coverage, source/API failures, unresolved IDs/reasons, receipts, exact recovery paths and deployment status. Reopen docs and check links. Hand off: how many targets, fields/covers added, remaining gaps, user questions and limitations. Never claim all metadata or duplicates solved merely because a batch completed.


## 2 November 2026: all 819 bookshop metadata records processed

Completed the remaining 649 post-JEV single-book records (171-819): **550 catalogue matches, 478 accepted covers, 99 unresolved matches and 72 other cover gaps**. All 649 catalogue/JEV calls finished before corrections. One bounded retrieval pass; no repeated recovery searches.

Across all four campaigns: **819 processed, 692 catalogue matches, 600 accepted covers, 127 unresolved matches and 92 metadata-only cover gaps**. These are photo records, including repeat photos of the same book; they are not a count of unique works.

[Search all records](../Bookshop trips/Book-metadata.html) | [Complete CSV](../Bookshop trips/books-metadata.csv) | [Complete JSON](../Bookshop trips/books-metadata.json) | [127 unresolved matches](../Bookshop trips/metadata-needs-research.csv) | [92 cover gaps](../Bookshop trips/metadata-cover-gaps.csv) | [Campaign evidence](_build/metadata_enrichment/bookshop_remaining_20261102/README.md).

All 475 JEV-selected actual images in the remaining campaign were visually inspected, plus 26 none-case image assets and seven alternative assets. Wrong-language, wrong-volume, audiobook, interior-page and placeholder assets were held or replaced using existing evidence. Six incompatible Open Library edition-detail responses were excluded from accepted bibliography; raw receipts remain. All 600 final cover hashes and image decodes, original-row equality, 819 unique photo IDs and report links passed verification. Sixty-six duplicate-similarity pairs were reviewed; separate photo records remain intact. Catalogue editions and cover artwork do not establish the exact edition photographed. Original source CSV unchanged; no personal-library or hosted changes.

This completion supersedes earlier metadata in-progress/next-record notices without removing their history. **No unprocessed single-book rows remain in the frozen 819-row source.** Continue only from the explicit unresolved/cover-gap lists, with fresh authorization for further external research. Original extraction uncertainties (including the 23 extra extraction checks) remain separate and are not claimed resolved by catalogue enrichment. User reported weekly usage still 21% at campaign start; ending meter unavailable, no usage delta inferred.

## Cover renditions, added 2 November 2026

After adding, replacing or correcting any cover file, run `python _build/mvp_to_prod_20261102/make_web_covers.py` from the Dashboard folder so `covers/web/` has a current 640 px rendition, and include `covers/web/` in the published release. The page falls back to the original if a rendition is missing, which works but is slow on phones.


## 2 November 2026: bookshop metadata recovery completed

The user authorized further research on all127 unmatched books and92 existing cover gaps, using photographs. **125 of127 catalogue matches resolved;84 of92 existing cover gaps filled.** Another103 newly matched books gained covers:187 covers added in total. Current819-photo totals: **817 catalogue matches,787 covers,2 unmatched and30 matched without a compatible usable cover**. These are photo records, including repeated books, not unique-work counts.

All219 target photographs were inspected. All219 initial and33 targeted follow-up JEV decisions finished before final corrections. Candidate/source identity and every accepted new actual front cover were manually reviewed. Wrong works, languages, numbered volumes, unavailable images, placeholders and promotional overlays were rejected or replaced. Original extraction values,819 photo IDs/order,600 existing covers and all600 untargeted records are preserved. Resolved title/author corrections are displayed alongside original extraction fields. Unknown catalogue edition facts remain blank; no exact photographed edition is claimed. No personal-library, hosted-data or deployment changes.

Only two catalogue matches remain unconfirmed: record15, *Michelangelo* (Scripta Maneant; precise volume unclear), and record603, *Flux: The Story of Female Pleasure* (Kate Lister). The30 cover gaps are a separate list. Earlier in-progress/unresolved counts are historical and superseded by this completion; their evidence is retained.

[Recovery evidence](_build/metadata_enrichment/bookshop_recovery_20261102/README.md)


### Recovery lessons from the219 bookshop targets

Use the original photo to resolve generic/truncated titles, author OCR and printed volume numbers before accepting a catalogue source. Keep immutable extraction values separate from resolved display fields. A JEV work choice and cover choice are independent leads; inspect the actual image, require a local asset and hash, and reject wrong-volume/wrong-language/related-book images even at high confidence. Network/output errors are not model rejections. Cache successful responses; retry only missing decisions after correcting image dimensions/request size. Report initial and follow-up bucket distributions separately because targets overlap and manual acceptance differs. For work-only recovery, retain authoritative source evidence and withhold unsupported edition facts. Do not run the personal-library cover-rendition/deployment pipeline for local bookshop staging artifacts.


### 2 November 2026: Goodreads native-browser follow-up

Found record603 by searching Kate Lister: the photographed title is **FLICK: The Story of Female Pleasure**, not Flux. Corrected resolved metadata and added a visually checked compatible cover; original extraction preserved. Goodreads catalogue edition facts are explicitly DIGITAL/Kindle and do not identify the photographed print edition. Michelangelo remains unresolved: Fabio Scaletti’s Slovenian Michelangelo, velikan: 500 let is an unconfirmed lead with different binding. Current totals: **819 photos,818 catalogue matches,788 covers,1 unmatched,30 matched without cover**. This supersedes the preceding two-unmatched counts. Source/old-new deltas, five immediate pre-follow-up exports and validation are retained as goodreads-* files in the recovery evidence folder. No personal-library or hosted edits.
