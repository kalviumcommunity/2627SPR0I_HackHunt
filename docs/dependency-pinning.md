# Repeatable Dependency Pinning

## 1. Language Dependency Pinning

HackHunt uses Node.js and npm.

- Dependency manifest: `backend/package.json`
- Committed lockfile: `backend/package-lock.json`
- The lockfile records the exact resolved dependency versions.
- Docker installs production dependencies using `npm ci --omit=dev`.
- Developers should use `npm ci` for repeatable local installations.

## 2. Container Base Image Pinning

The backend Dockerfile uses:

`node:20.20.2-alpine3.23`

This pins the Node.js and Alpine Linux version tags. The floating `latest` tag is not used.

## 3. Deliberate Upgrade Process

A teammate upgrades dependencies intentionally by:

1. Reviewing the required dependency update.
2. Updating the dependency using npm in the backend directory.
3. Committing the updated `package.json` and `package-lock.json` together.
4. Running tests and lint checks.
5. Building and verifying the Docker image.

To update the base image, the teammate changes the exact `FROM` tag in `backend/Dockerfile`, builds and tests the image, and commits the change for review.

## 4. Overnight Drift Prevention

Without pinning, a floating dependency version or `latest` base-image tag could resolve to a newer release overnight, changing the build without a source-code commit.

With the committed lockfile, `npm ci`, and the exact Docker base-image tag, dependency resolution and the selected base-image version do not silently move during an ordinary build.

An upgrade happens only through a deliberate, reviewed commit. Pinning does not prevent planned upgrades; it makes them visible and traceable.
