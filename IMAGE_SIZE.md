# Docker image optimisation

- **Image:** `2627spr0i_hackhunt-app:latest`
- **Previous local image size:** 228 MB (`docker image ls`, image ID `83adb1aef9fc`, created 2026-11-18).
- **Optimised local image size:** 172 MB (`docker image ls`, measured 2026-11-25).
- **Optimisation:** approximately 56 MB smaller, based on the rounded sizes reported by Docker.

The runtime now uses a small pinned Alpine base and copies in only the pinned Node runtime, npm, and production dependencies from build stages. The Node executable is stripped in a build stage; build tools, Node headers, Corepack, and development dependencies are not included in the final image. npm's install cache is cleaned. The Docker build context excludes tests and documentation; existing exclusions for local dependencies and environment files remain. The `node` user, npm scripts, port, and `npm start` container command are preserved.

The README startup command remains:

```powershell
docker compose up -d --build
```

**Application startup verification:** The optimised image built and started in an isolated Docker Compose project with a fresh PostgreSQL service. `/health` returned `{"status":"ok"}` and the expected startup log was present. The normal project command was also attempted, but the app could not authenticate against the existing local PostgreSQL volume using the available backend environment configuration. Set the root `.env` credentials to match that database and rerun the README command to verify the normal project setup.

**Classmate pull was not measured.**
