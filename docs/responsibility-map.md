# Cloud Responsibility Map

## 1. Assigned host and model

The assigned host is Render free tier, using the PaaS model. We give Render a Docker image or repository, and Render runs the OS, container runtime, edge network and TLS. We still own configuration, secrets, data, access and application code. Our database is MongoDB Atlas (free cluster), a separate provider from Render.

## 2. Responsibility table

| Layer | Owner | Evidence |
|---|---|---|
| Hardware and facility | Provider (Render) | https://render.com/docs/shared-responsibility-model. The Render responsibilities list says Render secures the infrastructure that hosts the hardware, software, networking and facilities. |
| OS patches | Provider (Render) | https://render.com/docs/shared-responsibility-model — Render is responsible for making sure all underlying operating systems are "patched and up to date". |
| Container runtime | Split. Provider (Render) runs the container runtime. Team: Joshua owns the base image version in our Dockerfile and keeps it updated. | Provider part: https://render.com/docs/shared-responsibility-model (Render secures the platform and its middleware). Team part: Dockerfile at the repo root, not yet done, closed in a later LU |
| Network and firewall | Split. Provider (Render) runs the public edge, DDoS protection and HTTP to HTTPS redirect. Team: Joshua owns the MongoDB Atlas IP access list and who can reach the database. | Provider part: https://render.com/docs/shared-responsibility-model and https://render.com/docs/tls (HTTP to HTTPS redirect). Team part: Atlas Network Access setting, not yet done, closed in a later LU. |
| Network and firewall | Split. Provider (Render) runs the public edge, DDoS protection and HTTP to HTTPS redirect. Team: Joshua owns the MongoDB Atlas IP access list and who can reach the database. | Provider part: https://render.com/docs/shared-responsibility-model and https://render.com/docs/tls (HTTP to HTTPS redirect). Team part: Atlas Network Access setting, not yet done, closed in a later LU. |
| TLS certificate | Provider (Render) | https://render.com/docs/tls . Render provides fully managed, free TLS certificates for onrender.com and custom domains, and redirects HTTP to HTTPS. |
| Database backups | Team: Issac | https://www.mongodb.com/docs/atlas/backup-restore-cluster/ . Atlas backups are not available on Free (M0) clusters, so there is no provider backup. We must take our own backups with `mongodump` and restore with `mongorestore`. https://render.com/docs/free explains that Render free web services have an ephemeral filesystem, so a backup must never be stored on the Render service itself. Not yet done, closed in a later LU. |
| Secrets and config | Team: Joshua | Secrets will live in Render environment settings and GitHub Actions secrets (names only, never values). Render's page lists protecting secrets as a customer responsibility: https://render.com/docs/shared-responsibility-model. Environment settings not set up yet, closed in a later LU. |
| Application code | Team: Issac (primary, backend), Sera (frontend) | Repo paths not created yet, closed in a later LU. |

## 3. What we would have wrongly assumed

We would have assumed the cloud company patches the OS no matter what kind of host we use. On a VM (IaaS), the provider's own documentation says the customer owns the guest OS. If we had written "OS patches: Provider," nobody would run updates and a known bug could stay open for a month. On Render (PaaS), the provider really does own OS patches, and we proved it by linking Render's documentation instead of guessing. We would also have assumed database backups were handled by the provider, but Atlas free clusters have none, so backups are our row.


## 4. Region and location

- Render service region: Singapore (planned, not deployed yet). Reason: it is the nearest free Render region for campus users in India. The MongoDB Atlas cluster should be in a nearby region, planned as Mumbai or Singapore, so the web service and database are close and latency stays low.
- Measured connect time: 0.56 seconds to Render's network. Our service is not deployed yet, so this was measured with `curl -o /dev/null -s -w '%{time_connect}\n'` against a placeholder Render address, from my home network, on 11 Nov 2026. We will measure our real service after deployment.
- Note: free Render web services spin down after 15 minutes without traffic, so the first request after idle can take up to about a minute. Source: https://render.com/docs/free

## 5. Owner confirmation

- Issac: confirm in the PR review that he accepts the rows assigned to him.
- Sera: confirm in the PR review that she accepts the rows assigned to her.
- Joshua: confirm in the PR review that he accepts the rows assigned to him.
