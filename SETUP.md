# Local Setup Note

Project: HackHunt (Opportunity Board)

## Tool versions

| Tool | Version (from my terminal) | Command used |
|---|---|---|
| Container runtime | Docker Engine 29.7.2 | `docker version --format '{{.Server.Version}}'` |
| Compose | Docker Compose version v5.5.0 | `docker compose version` |
| Git | git version 2.55.0.windows.5 | `git --version` |
| PostgreSQL client | psql (PostgreSQL) 17.11 | `psql --version` |

## Host for this sprint

Render free tier

## Cost

No payment card or paid plan was used.

## Hello-world check

Command:

```bash
docker run --rm hello-world
```

Result: The image was pulled from Docker Hub. The container printed "Hello from Docker! This message shows that your installation appears to be working correctly." and then exited.

## How a teammate matches this setup

1. Install Docker Desktop (it includes Compose), Git and the PostgreSQL client tools only (Command Line Tools, not the server).
2. Start Docker Desktop and wait until it shows "Engine running". If the engine is not running, Docker commands fail with "failed to connect to the docker API".
3. On Windows Git Bash, if `psql` is not found, add it to the PATH:
   ```bash
   export PATH="$PATH:/c/Program Files/PostgreSQL/17/bin"
   ```
4. Run these four commands and compare with the table above:
   ```bash
   docker version --format '{{.Server.Version}}'
   docker compose version
   git --version
   psql --version
   ```
5. Run `docker run --rm hello-world`. It must print the hello message and exit.
6. If a command is missing, install it and tell the team before starting work.