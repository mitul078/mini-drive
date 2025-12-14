# miniDrive

A lightweight, microservices-based backend for a "mini drive" application. The system is split into three independent Node.js services that communicate via RabbitMQ message queues and share authentication through JWT cookies.

## Key Features & Development Highlights

### 🏗️ Architecture & Design
- **Microservices Architecture**: Decoupled services with single responsibility principle (Auth, Folder, File management)
- **Event-Driven Design**: Asynchronous communication via RabbitMQ message queues for loose coupling
- **Scalable Architecture**: Independent services can scale horizontally based on load requirements
- **Database Per Service**: Each microservice maintains its own MongoDB database for data isolation

### 🔐 Security & Authentication
- **JWT-based Authentication**: Secure token-based auth with HTTP-only cookies to prevent XSS attacks
- **Password Security**: bcryptjs hashing with 10 salt rounds
- **Rate Limiting**: Implemented express-rate-limit to prevent abuse (5 requests/10 seconds)
- **Input Validation**: express-validator for comprehensive request validation
- **Role-Based Access Control**: Middleware for role-based authorization

### ⚡ Performance & Optimization
- **Redis Caching**: Folder verification caching with TTL to reduce database queries
- **Efficient File Handling**: In-memory file processing with Multer before uploading to cloud storage
- **Connection Pooling**: Optimized database and message queue connections
- **Event-Driven Caching**: Real-time cache updates via message queue subscriptions

### 🔄 Message Queue & Event System
- **RabbitMQ Integration**: Reliable message queuing with durable queues for inter-service communication
- **Event Sourcing Pattern**: User creation triggers automatic root folder creation via events
- **Pub/Sub Architecture**: Services subscribe to relevant events for decoupled workflows
- **Idempotent Operations**: Safe event handling with proper acknowledgment mechanisms

### 🛠️ Development Best Practices
- **Docker Containerization**: Each service containerized with optimized Node.js Alpine images
- **Environment Configuration**: Centralized `.env` configuration management
- **Error Handling**: Comprehensive try-catch blocks with appropriate HTTP status codes
- **Code Organization**: Modular structure with separation of concerns (routes, controllers, models, middleware)
- **Logging**: Structured logging for debugging and monitoring

### 📦 Technology Integration
- **Cloud Storage Integration**: ImageKit for scalable file storage and CDN delivery
- **Multi-Database Support**: MongoDB for document storage, Redis for caching
- **RESTful API Design**: Clean REST endpoints with proper HTTP methods and status codes
- **Express 5 Framework**: Modern Express.js features with middleware support

### 🚀 Scalability Considerations
- **Horizontal Scaling**: Services can be independently scaled based on traffic patterns
- **Stateless Services**: JWT-based auth enables stateless service design
- **Cache-First Strategy**: Redis caching reduces database load for frequently accessed data
- **Async Processing**: Non-blocking file uploads and event processing

### 🔍 Code Quality
- **Modular Architecture**: Clear separation between business logic, data access, and routing
- **Middleware Pattern**: Reusable authentication and validation middleware
- **Service Discovery**: Clear service boundaries with well-defined APIs
- **Error Propagation**: Proper error handling and user-friendly error messages

## Architecture

The application follows a microservices architecture with three core services:

- **Auth Service** (`server/auth`): Handles user registration, login, and JWT token management. Publishes `USER_CREATED:FOLDER_SERVICE` events when new users register.
- **Folder Service** (`server/folder`): Manages per-user folder hierarchy. Automatically creates a root folder when a user is created. Publishes `FOLDER_VERIFIED:FILE_SERVICE` events when folders are validated.
- **File Service** (`server/file`): Handles file uploads to ImageKit, stores metadata in MongoDB, and validates folder ownership via Redis cache before allowing uploads.

## Tech Stack

- **Runtime**: Node.js 18+ with Express 5
- **Database**: MongoDB (Mongoose ODM)
- **Message Queue**: RabbitMQ (amqplib) for inter-service communication
- **Cache**: Redis (ioredis) for folder verification caching
- **Authentication**: JWT tokens stored in HTTP-only cookies
- **File Storage**: ImageKit for object storage
- **Validation**: express-validator for input validation
- **Security**: bcryptjs for password hashing, express-rate-limit for rate limiting
- **Orchestration**: Docker Compose for local development

## Service Ports

- **Auth Service**: `4001`
- **Folder Service**: `4002`
- **File Service**: `4003`

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or remote)
- Redis instance (local or remote)
- RabbitMQ instance (local or remote)
- ImageKit account with API keys (for file service)

### Docker Setup

```bash
cd server
docker compose up --build
```

**Note**: Docker Compose does not include MongoDB, Redis, or RabbitMQ services. Ensure these are running separately or add them to `docker-compose.yml`.

### Local Development Setup

1. **Clone the repository** (if applicable)

2. **Install dependencies for each service**:
   ```bash
   # Auth service
   cd server/auth && npm install
   
   # Folder service
   cd ../folder && npm install
   
   # File service
   cd ../file && npm install
   ```

3. **Create `.env` files** for each service (see Environment Variables below)

4. **Start each service** (in separate terminals):
   ```bash
   # Terminal 1 - Auth
   cd server/auth && npm run dev
   
   # Terminal 2 - Folder
   cd server/folder && npm run dev
   
   # Terminal 3 - File
   cd server/file && npm run dev
   ```

## Environment Variables

Create a `.env` file in each service directory:

### Auth Service (`server/auth/.env`)
```env
PORT=4001
MONGO_URI=mongodb://localhost:27017/minidrive-auth
JWT_SECRET=your-super-secret-jwt-key-here
RABBIT_URL=amqp://localhost:5672
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS=
```

### Folder Service (`server/folder/.env`)
```env
PORT=4002
MONGO_URI=mongodb://localhost:27017/minidrive-folder
JWT_SECRET=your-super-secret-jwt-key-here
RABBIT_URL=amqp://localhost:5672
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS=
```

### File Service (`server/file/.env`)
```env
PORT=4003
MONGO_URI=mongodb://localhost:27017/minidrive-file
JWT_SECRET=your-super-secret-jwt-key-here
RABBIT_URL=amqp://localhost:5672
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS=
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

**Important**: 
- All services must use the same `JWT_SECRET` for token validation
- All services must use the same RabbitMQ instance
- All services must use the same Redis instance

## API Documentation

### Auth Service

Base URL: `http://localhost:4001/api/v1/auth`

#### Register User
- **POST** `/signup`
- **Body**: 
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "name": "string"
  }
  ```
- **Response**: Sets JWT cookie and returns user object (excluding password)
- **Rate Limit**: 5 requests per 10 seconds
- **Events**: Publishes `USER_CREATED:FOLDER_SERVICE` queue message

#### Login
- **POST** `/signin`
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: Sets JWT cookie and returns user object
- **Rate Limit**: 5 requests per 10 seconds

### Folder Service

Base URL: `http://localhost:4002/api/v1/folder`
- All endpoints require authentication via JWT cookie (`token`)

#### Create Folder
- **POST** `/`
- **Headers**: Cookie with `token`
- **Body**:
  ```json
  {
    "folderName": "string",
    "parentFolderId": "string (ObjectId)"
  }
  ```
- **Response**: Created folder object

#### Verify Folder
- **GET** `/:id`
- **Headers**: Cookie with `token`
- **Purpose**: Validates folder belongs to authenticated user
- **Response**: Folder object if valid
- **Events**: Publishes `FOLDER_VERIFIED:FILE_SERVICE` queue message

### File Service

Base URL: `http://localhost:4003/api/v1/file`
- All endpoints require authentication via JWT cookie (`token`)

#### Upload File
- **POST** `/upload`
- **Headers**: Cookie with `token`, `Content-Type: multipart/form-data`
- **Body**: 
  - `file`: File (multipart form data)
  - `folderId`: string (ObjectId)
- **Allowed Types**: `image/jpeg`, `image/png`, `image/jpg`, `application/pdf`
- **Response**: Uploaded file metadata
- **Note**: Folder must be verified (via GET `/api/v1/folder/:id`) before upload

#### Get Files in Folder
- **GET** `/:id` (where `:id` is folder ID)
- **Headers**: Cookie with `token`
- **Response**: Array of file objects in the specified folder

#### Delete File
- **DELETE** `/:id` (where `:id` is file ID)
- **Headers**: Cookie with `token`
- **Response**: Success message
- **Note**: Deletes file from both ImageKit and MongoDB

## Event Flow

The services communicate via RabbitMQ queues:

1. **User Registration Flow**:
   - User registers via Auth service
   - Auth service publishes `USER_CREATED:FOLDER_SERVICE` with `{ userId }`
   - Folder service subscribes and creates root folder for the user
   - Root folder path is `/` and `parentFolderId` references itself

2. **File Upload Flow**:
   - Client verifies folder via Folder service (`GET /api/v1/folder/:id`)
   - Folder service publishes `FOLDER_VERIFIED:FILE_SERVICE` with `{ userId, folderId, path }`
   - File service caches this verification in Redis (TTL: 1 hour)
   - Client uploads file via File service (`POST /api/v1/file/upload`)
   - File service validates folder from Redis cache before allowing upload

## Development Notes

### Security
- JWT tokens are stored in HTTP-only cookies to prevent XSS attacks
- Passwords are hashed using bcryptjs (10 rounds)
- Rate limiting is enabled in Auth and Folder services (5 requests per 10 seconds)
- CORS is configured in all services

### Database Indexes
- Folder model has a compound unique index on `{ folderName: 1, userId: 1 }` to prevent duplicate folder names per user
- Ensure legacy single-field indexes are removed if present

### Redis Caching
- Folder verifications are cached with key pattern: `verifiedFolders:{folderId}`
- Cache TTL: 1 hour (3600 seconds)
- Redis is used for fast folder ownership validation during file uploads

### File Upload
- Files are stored in ImageKit under folder: `mini-drive`
- File names are prefixed with userId: `{userId}-{originalname}`
- Multer uses in-memory storage; files are forwarded to ImageKit as buffers
- Supported file types: JPEG, PNG, JPG, PDF

### Error Handling
- All services use try-catch blocks with appropriate HTTP status codes
- Validation errors return 400 status
- Authentication errors return 401/403 status (via middleware)
- Server errors return 500 status

## Troubleshooting

### Duplicate Root Folder Errors
- Ensure Folder service handles root creation idempotently
- Verify MongoDB has the compound unique index on `{ folderName: 1, userId: 1 }`
- Check for and remove legacy single-field `folderName_1` index if present

### RabbitMQ Connection Issues
- Verify `RABBIT_URL` is correct in all service `.env` files
- Ensure RabbitMQ is running and accessible
- Check RabbitMQ connection logs in service console output

### Redis Connection Issues
- Verify `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASS` in all service `.env` files
- Ensure Redis is running and accessible
- Check Redis connection in service logs

### JWT Authentication Issues
- Ensure all services use the same `JWT_SECRET`
- Verify cookies are being sent with requests (check browser dev tools)
- For CORS/cookies in browsers, set correct `domain` and `secure` flags in production
- In development, ensure `secure: true` is set to `false` if using HTTP (not HTTPS)

### File Upload Failures
- Verify ImageKit credentials are correct
- Ensure folder is verified before upload (call `GET /api/v1/folder/:id` first)
- Check file type is allowed (images: jpeg, png, jpg; documents: pdf)
- Verify Redis cache contains folder verification (check cache TTL hasn't expired)

### MongoDB Connection Issues
- Verify `MONGO_URI` is correct in each service
- Ensure MongoDB is running and accessible
- Each service uses a separate database: `minidrive-auth`, `minidrive-folder`, `minidrive-file`

## Project Structure

```
miniDrive/
├── README.md
└── server/
    ├── docker-compose.yml
    ├── auth/
    │   ├── dockerfile
    │   ├── package.json
    │   ├── server.js
    │   └── src/
    │       ├── app.js
    │       ├── broker/
    │       │   └── broker.js
    │       ├── config/
    │       │   └── db.js
    │       ├── middleware/
    │       │   ├── auth.middleware.js
    │       │   ├── role.middleware.js
    │       │   └── validator.middleware.js
    │       └── modules/
    │           ├── auth.controller.js
    │           ├── auth.model.js
    │           └── auth.route.js
    ├── folder/
    │   ├── dockerfile
    │   ├── package.json
    │   ├── server.js
    │   └── src/
    │       ├── app.js
    │       ├── broker/
    │       │   ├── broker.js
    │       │   └── listeners.js
    │       ├── config/
    │       │   └── db.js
    │       ├── middlewares/
    │       │   └── auth.middleware.js
    │       └── modules/
    │           ├── folder.controller.js
    │           ├── folder.model.js
    │           └── folder.route.js
    └── file/
        ├── dockerfile
        ├── package.json
        ├── server.js
        └── src/
            ├── app.js
            ├── broker/
            │   ├── broker.js
            │   └── listeners.js
            ├── config/
            │   ├── db.js
            │   ├── imagekit.js
            │   └── redis.js
            ├── events/
            │   └── folder.subscriber.js
            ├── middleware/
            │   └── auth.middleware.js
            └── modules/
                ├── file.controller.js
                ├── file.model.js
                └── file.route.js
```
