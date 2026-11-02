# Library domain — 2 November 2026

New library addresses: **https://tiagobooks.com/** and **https://www.tiagobooks.com/**.

Existing fallback remains https://book-library-production-4bee.up.railway.app/. All addresses use the same Railway service and hosted Supabase library; no copy, migration or reseeding of book data is needed. The same editing password applies; an editing session must be opened separately on a new hostname.

## What changed and why

Namecheap previously had two unmasked URL redirects, `@` and `www`, to `https://medium.com/@tiagofaleiro`. The user confirmed the blog is unused and explicitly authorized replacing both redirects with the library.

| Namecheap type | Host | Target | TTL |
|---|---|---|---|
| ALIAS | `@` | `yeooxx0c.up.railway.app` | 5 min |
| CNAME | `www` | `y05ppgyj.up.railway.app` | 5 min |
| TXT | `_railway-verify` | Railway-issued ownership proof | Automatic |
| TXT | `_railway-verify.www` | Railway-issued ownership proof | Automatic |

The root ALIAS provides apex flattening while retaining email records. Email Forwarding and its existing SPF record were left unchanged; nameservers were not changed. Railway manages HTTPS certificates for each hostname. Do not replace these targets with guessed IP addresses. Both hostnames currently serve the library directly; no canonical-host redirect has been added.

## Verification and recovery

`_build/domain_20261102/verification.json` records the latest actual DNS, certificate and HTTPS result. A saved DNS row alone does not establish public readiness: verify ownership, certificate issuance and successful library responses. Never bypass a certificate warning to claim success.

Exact previous redirects: `namecheap-before.json`; saved replacement records: `namecheap-after.json`; Railway domain IDs/targets: `railway-domains.json`; ownership requirements: `ownership-verification-requirements.json`, all under `_build/domain_20261102/`. These preserve the setup without exposing account credentials.

To undo the web routing, restore the two recorded unmasked Medium redirects in Namecheap, preserving email records. Remove only these library-domain bindings if explicitly requested; do not delete the Railway app, fallback address or Supabase data. A future DNS move must preserve or replace ownership records and verify HTTPS again.
