# Tiago's Library

A public book library with cover, list and table views, personal ratings, reading timelines, search and filters. The TBR catalogue groups reading interests by where they were discovered, including bookshop visits.

**[Visit tiagobooks.com](https://tiagobooks.com)**

## Run locally

Requires Node.js 22 or newer and your own Supabase project. There are no production npm dependencies.

1. Clone this repository.
2. Copy `.env.example` to `.env` and fill in your own values. Keep `.env` untracked.
3. Run `supabase.sql` in your project's SQL editor. It creates the storage table and an empty library without replacing existing data.
4. Start the app:

   ```sh
   node --env-file=.env server.mjs
   ```

5. Open `http://localhost:8732`. Sign in with the password you configured to add books or import a library through the admin tools.

The hosted library loads from the backend; this source code contains no embedded personal-library snapshot. `tbr-bookshops.json` and its cover images are the public catalogue displayed on the website. They can be replaced with your own catalogue using the same schema.

## Architecture

| File | Purpose |
|---|---|
| `index.html` | Library interface, themes, timeline and editor |
| `tbr.js`, `tbr.css` | TBR browsing, discovery filters and incremental scrolling |
| `tbr-bookshops.json` | Public bookshop catalogue and visit information |
| `server.mjs` | Node HTTP server, sessions, Supabase storage, caching and compression |
| `covers/` | Cover assets and optimized browsing images |
| `supabase.sql` | Storage schema and row-level access restrictions |
| `Dockerfile`, `railway.json` | Container and hosting configuration |

The backend keeps Supabase credentials on the server. Public visitors browse without an account; a password enables editing through a signed session cookie. Revision checks protect against concurrent edits.

## Tests

```sh
npm test
```

Tests use isolated mock storage rather than a production database. They cover authentication, saving, caching, static routes, catalogue integrity and publication boundaries.

## Deployment

Build with the Dockerfile and configure the variables in `.env.example` on your host. Set `NODE_ENV=production` and serve behind HTTPS so admin cookies are secure. The `/health` route checks storage availability.

See [CONTRIBUTING.md](CONTRIBUTING.md) for changes and checks, and [CHANGELOG.md](CHANGELOG.md) for public release notes.
