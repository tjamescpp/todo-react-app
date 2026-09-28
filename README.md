# Odin Todo React App

A full-stack task management application built with React on the frontend and
Express + Prisma on the backend. Users can create accounts, authenticate with
JWT, manage projects, and organize tasks with due dates, priorities, and project
assignments.

Check out the app by going to this link: https://tasker-v0h9.onrender.com/

- Username: 123@email.com
- Password: tommy123

Feel free to create, update, or delete tasks and projects!

## Features

- User registration and login
- JWT-based authentication
- Task creation, editing, and deletion
- Project-based organization
- Due dates and priority labels
- Profile picture upload via Cloudinary
- PostgreSQL data persistence with Prisma
- Responsive single-page UI built with Vite and React

## Tech Stack

- Frontend: React, Vite, JavaScript
- Backend: Node.js, Express
- Database: PostgreSQL with Prisma ORM
- Authentication: JWT + Passport
- Media upload: Cloudinary
- CORS enabled for local frontend development

## Project Structure

```text
.
├── client/
│   ├── src/
│   ├── public/
│   ├── .env.development
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── prisma/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── app.js
│   └── package.json
├── README.md
└── .gitignore
```

## Prerequisites

Before you begin, make sure you have:

- Node.js 18+
- npm
- PostgreSQL database
- Cloudinary account (for profile image uploads)

## Installation

1. Install frontend dependencies:

```bash
cd client
npm install
```

2. Install backend dependencies:

```bash
cd ../server
npm install
```

3. Configure environment variables.

Create or update the server `.env` file with values similar to:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/todo_app"
PORT=3000
NODE_ENV=development
JWT_SECRET="your_jwt_secret"
SESSION_SECRET="your_session_secret"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

The frontend also expects the API URL in `client/.env.development`:

```env
VITE_API_URL=http://localhost:3000
```

## Database Setup

Generate the Prisma client and run migrations:

```bash
cd server
npx prisma generate
npx prisma migrate dev
```

## Running the App

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd client
npm run dev
```

Then open the app in your browser at:

```text
http://localhost:5173
```

The backend API will run at:

```text
http://localhost:3000
```

## Common Scripts

### Client

```bash
cd client
npm run dev
npm run build
npm run preview
```

### Server

```bash
cd server
npm run dev
npm start
```

## Notes

- The frontend uses `VITE_API_URL` to point to the backend.
- The server is configured with CORS for local Vite development and the deployed
  app origin.
- Prisma schema and migrations live under `server/prisma`.

## License

This project is for educational and personal project use.
