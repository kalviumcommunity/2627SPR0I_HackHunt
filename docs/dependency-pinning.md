# Dependency pinning

## What is pinned

- Backend package versions are in `backend/package-lock.json`. `npm ci --omit=dev` installs only the locked versions and fails if the lockfile and `package.json` disagree.
- The Docker base image in `backend/Dockerfile` is pinned to `node:20.20.2-alpine3.23`.

## What could have changed overnight with no commit

- A moving tag such as `latest` or `node:20-alpine` can point to a new Node or Alpine release.
- `npm install` with `^` ranges can pick newer package versions.
- The same source can then build differently.

## What cannot change now

- The Node and Alpine versions are set by the exact image tag.
- Package versions are fixed by the lockfile when using `npm ci`.
- Any change must be a visible commit in a pull request.

## How to upgrade on purpose

1. Create a branch such as `chore/upgrade-node`.
2. Change the tag in `backend/Dockerfile` to a newer exact tag after checking it with `docker pull`, or run `npm install <package>@<version>` in `backend/` to update `package.json` and `package-lock.json`.
3. Rebuild with `docker build -t hackhunt-backend ./backend`, run `npm test` in `backend/`, and check `/health`.
4. Commit the Dockerfile or lockfile change in a pull request with the reason, and have a teammate review it.
