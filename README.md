## miniDrive

Lightweight, service-oriented backend for a “mini drive” application. It is split into three Node.js services:
- **Auth** (`server/auth`): user registration/login with JWT cookies; publishes `auth:user-created` events.
- **Folder** (`server/folder`): per-user folder hierarchy, root bootstrap on user creation; publishes verified folders to Redis.
- **File** (`server/file`): uploads to ImageKit, stores metadata in MongoDB, and validates folder ownership via Redis cache.

### Tech Stack
- Node.js + Express
- MongoDB (Mongoose)
- Redis (Pub/Sub + cache)
- JWT (HTTP-only cookies)
- ImageKit for object storage
- Docker Compose for local orchestration

### Service Ports (default)
- Auth: `4001`
- Folder: `4002`
- File: `4003`

### Quick Start (Docker)
```bash
cd server
docker compose up --build
```
Provide `.env` files for each service before starting (see below).

### Quick Start (Local)
Prereqs: Node 18+, MongoDB, Redis, ImageKit account/keys.
```bash
# Auth
cd server/auth && npm install && npm run dev
# Folder
cd ../folder && npm install && npm run dev
# File
cd ../file && npm install && npm run dev
```

### Environment Variables
Create a `.env` in each service directory.

**Auth (`server/auth/.env`)**
```
PORT=4001
MONGO_URI=mongodb://localhost:27017/minidrive-auth
JWT_SECRET=super-secret
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS=
```

**Folder (`server/folder/.env`)**
```
PORT=4002
MONGO_URI=mongodb://localhost:27017/minidrive-folder
JWT_SECRET=super-secret
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS=
```

**File (`server/file/.env`)**
```
PORT=4003
MONGO_URI=mongodb://localhost:27017/minidrive-file
JWT_SECRET=super-secret
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS=
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

### API Overview
- **Auth**
  - `POST /api/v1/auth/register` – create user; sets JWT cookie and emits `auth:user-created`.
  - `POST /api/v1/auth/login` – login; sets JWT cookie.
- **Folder**
  - `POST /api/v1/folder` – create folder `{ folderName, parentFolderId }`; requires auth cookie.
  - `GET /api/v1/folder/:id` – validate folder belongs to user and publish `folder:verified`.
- **File**
  - `POST /api/v1/file/upload` – multipart upload (`file`); body `{ folderId }`; requires auth cookie.
  - `GET /api/v1/file/:id` – list files in folder.
  - `DELETE /api/v1/file/:id` – delete file by id.

### Event Flow
1. Auth registers a user → publishes `auth:user-created { userId }`.
2. Folder service subscribes, creates the user’s root folder, and can publish `folder:verified` on folder checks.
3. File service subscribes to `folder:verified`, caches the folder in Redis, and validates uploads against that cache.

### Development Notes
- Rate limiting is enabled in Auth and Folder services (5 requests / 10 seconds).
- Auth/Folder/File expect JWT cookies named `token`.
- Redis is required for inter-service messaging; ensure the same host/port/pass across services.
- ImageKit is required for file uploads; the file service uses in-memory multer storage and forwards buffers to ImageKit.

### Troubleshooting
- Duplicate root folder errors: ensure the Folder service handles root creation idempotently and that Mongo has the compound unique index on `{ folderName: 1, userId: 1 }`. Drop legacy single-field `folderName_1` if present.
- Verify Redis connectivity: check `REDIS_HOST/PORT/PASS` and that the subscriber logs show successful connections.
- For CORS/cookies in browsers, set the correct domain/secure flags in production.

