# Timebase Todo — Backend API

A Node.js + Express + MongoDB backend powering a React Native To-Do app with user authentication.

**Live API:** https://timebase-todo-backend.onrender.com

## Features

- **Authentication**: JWT-based register/login, passwords hashed with bcrypt
- **Task CRUD**: create, read, update (complete/edit), delete tasks
- **Smart sorting algorithm (bonus)**: tasks are ranked by a weighted urgency score that blends priority and deadline proximity, so a high-priority task due soon surfaces above a low-priority task due later — even if the low-priority task's raw deadline is technically closer
- **Per-user data isolation**: every task is scoped to the authenticated user's ID; no user can read or modify another user's tasks

## Tech Stack

- **Runtime**: Node.js + TypeScript (via `tsx`)
- **Framework**: Express
- **Database**: MongoDB Atlas + Mongoose
- **Auth**: JWT (`jsonwebtoken`) + `bcryptjs` for password hashing
- **Hosting**: Render

## Project Structure

## API Endpoints

| Method | Endpoint             | Auth required | Description                |
|--------|-----------------------|:--------------:|-----------------------------|
| POST   | `/api/auth/register`  | No             | Create a new account        |
| POST   | `/api/auth/login`     | No             | Log in, receive a JWT       |
| GET    | `/api/tasks`          | Yes            | Get the user's tasks, sorted by urgency |
| POST   | `/api/tasks`          | Yes            | Create a task                |
| PATCH  | `/api/tasks/:id`      | Yes            | Update a task (e.g. mark complete) |
| DELETE | `/api/tasks/:id`      | Yes            | Delete a task                |

Protected routes require an `Authorization: Bearer <token>` header, where `<token>` is the JWT returned from register/login.

## The Sorting Algorithm

Rather than sorting purely by deadline or purely by priority, `getTasks` computes a combined urgency score for each task:

```ts
const priorityWeight = { High: 30, Medium: 20, Low: 10 };
const urgency = 70 - Math.min(70, hoursToDeadline); // caps at 70, grows as deadline nears
const totalScore = priorityWeight[priority] + urgency;
```

This means a **High**-priority task due in 2 hours ranks above a **Low**-priority task due in 1 hour, but a **Low**-priority task due in 5 minutes still eventually overtakes a **High**-priority task due next week — the algorithm balances both signals instead of treating either in isolation.

## Setup

```bash
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev             # starts on http://localhost:5000
```

## Environment Variables

| Variable     | Description                        |
|--------------|--------------------------------------|
| `MONGO_URI`  | MongoDB Atlas connection string      |
| `JWT_SECRET` | Secret used to sign JWTs             |
| `PORT`       | Port to run the server on (default 5000) |

## Deployment

Deployed on [Render](https://render.com) as a Node web service. Build command: `npm install`. Start command: `npx tsx src/server.ts`. MongoDB Atlas network access is configured to accept connections from anywhere (`0.0.0.0/0`) since Render uses dynamic outbound IPs.
