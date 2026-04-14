# Devenops

This repository is a small full-stack demo application called `GameBoxd`.
It is structured as three separate services:

- `frontend`: a React UI
- `auth`: an Express service for login
- `games`: an Express service for the game catalog and user shelf

The app is closer to a demo or DevOps practice project than a production system.
It uses hard-coded demo credentials, a fixed in-memory game catalog, and Dockerfiles for each service.

## How To Start It

The intended end-to-end run path is containerized.
The React app calls `/api/*` and `/data/*`, and those routes are wired through nginx in the frontend container.

### Prerequisites

- Docker

### Build the images

```bash
docker build -t gameboxd-auth ./auth
docker build -t gameboxd-games ./games
docker build -t gameboxd-frontend ./frontend
```

### Create a shared Docker network

```bash
docker network create gameboxd
```

### Run the services

The container names matter here because nginx proxies to `auth:5000` and `games:4000`.

```bash
docker run -d --name auth --network gameboxd -p 5000:5000 gameboxd-auth
docker run -d --name games --network gameboxd -p 4000:4000 gameboxd-games
docker run -d --name frontend --network gameboxd -p 8080:80 gameboxd-frontend
```

### Open the app

Open `http://localhost:8080`

## What It Does

When the app is running:

1. You land on a login screen.
2. The frontend sends a request to the `auth` service.
3. On successful login, the frontend loads the game catalog from the `games` service.
4. You can view your shelf and add games from the catalog.

### Demo login

- Email: `devenvaru@gmail.com`
- Password: `123456`

### Current behavior

- The catalog is hard-coded to a small list of games.
- User shelves are stored in memory only.
- Restarting the `games` service clears saved shelf data.
- There is no database or real authentication backend.

## Repo Layout

```text
auth/      Express login service on port 5000
games/     Express catalog and shelf service on port 4000
frontend/  React app, built and served by nginx on port 80 in the container
```
