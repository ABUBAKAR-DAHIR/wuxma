# Wuxma – Figma AI Plugin (Developer Documentation)
<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/wuxma_dark_mode.svg">
    <source media="(prefers-color-scheme: light)" srcset="public/favicon-logo.svg">
    <img src="public/favicon-logo.svg" alt="Wuxma Logo" width="160">
  </picture>
</p>


Wuxma is a **production-grade Figma plugin** that integrates with a **Next.js web application** to generate editable Figma UI designs from natural language prompts using AI.

This README is **developer-focused** and explains the internal architecture, data flow, authentication model, and how the plugin, backend, and web app work together.

---

## Architecture Overview

Wuxma consists of three main layers:

1. **Figma Plugin**
   - React + TypeScript UI rendered inside Figma
   - Sends prompts and user state to backend
   - Executes backend responses into real Figma nodes

2. **Backend API (Next.js)**
   - Handles authentication, quota, rate limiting
   - Distinguishes guest vs authenticated users
   - Returns structured JSON instructions

3. **Web App (Next.js)**
   - Signup & login interface
   - Supports email/password and OAuth (Google, GitHub, etc.)
   - Links authenticated users to plugin sessions

---

## Core Concepts

### Device ID

Each plugin installation generates a persistent `deviceId`.

- Identifies anonymous users
- Links plugin usage to web authentication
- Sent with every backend request

This allows the plugin to stay stateless while the backend controls access.

---

### Session ID

- Created by backend when a guest user hits quota limits
- Temporarily represents an unauthenticated session
- Used to resume access after authentication

---

## End-to-End User Flow

### 1. Prompt Generation

1. User enters a prompt inside the Figma plugin
2. Plugin sends request to backend including:
   - `deviceId`
   - `sessionId` (if available)
   - prompt text

3. Backend performs:
   - guest vs authenticated checks
   - rate limiting
   - quota validation

4. Backend returns a JSON response
5. Plugin executes the response into Figma nodes

---

### 2. Guest Quota Enforcement

- Guest users are allowed **3 prompt generations**
- After quota exhaustion:
  - Backend responds with `QUOTA_EXHAUSTED`
  - Backend issues a `sessionId`

- Plugin:
  - Displays signup CTA
  - Stores session context

---

### 3. Signup & Authentication

1. User clicks **Sign Up** in plugin
2. Plugin opens a deep link to web app:


3. User authenticates via:
   - Email / password
   - Google OAuth
   - GitHub OAuth

4. Backend links authentication to the `deviceId`
```/auth/signin?deviceId=<device-id>```

---

### 4. Login Detection & Full Access

- Plugin polls backend for authentication status
- On detection:
  - Plugin receives `login_success`
  - UI updates instantly
  - Full access is unlocked

No plugin reload required.

---

## Plugin ↔ Backend Communication

### Plugin → Backend

- Uses `fetch` from plugin runtime
- Sends JSON payloads
- Stateless requests

Example:

```json
POST /api/plugin/generate
{
  "deviceId": "...",
  "sessionId": "...",
  "prompt": "Modern SaaS dashboard with sidebar"
}
```

## Backend → Plugin

Backend responses include:

- `success` (boolean)
- `output` (AI-generated instructions)
- `error` (if any)
- `sessionId` (when applicable)

The plugin executes instructions; it does not own business logic.

---

## Tech Stack

### Plugin
- Figma Plugin API
- React
- TypeScript
- Vite
- pnpm
- Tailwind CSS

### Backend / Web App
- Next.js
- API Routes
- OAuth providers
- Session-based authentication

---

## Project Structure

```text
wuxma-plugin/
├── src/
│   ├── components/        # Reusable UI components
│   ├── utils/             # Device ID, session, UI helpers
│   ├── types/             # Shared types
│   ├── App.tsx
│   ├── Home.tsx
│   └── main.tsx
├── lib/
│   └── code.ts            # Figma execution logic
├── public/
├── manifest.json
├── vite.config.ts
├── package.json
└── pnpm-lock.yaml
```

## Development Setup

### Prerequisites

- Node.js (LTS)
- pnpm
- Figma Desktop App

---

### Install Dependencies

```bash
pnpm install
```

---

### Run Plugin in Dev Mode

```bash
pnpm dev
```

---

### Load Plugin in Figma

1. Open **Figma Desktop App**
2. Go to **Plugins → Development → Import Plugin from Manifest**
3. Select `manifest.json`

---

## Design Principles

- Backend owns all business logic
- Plugin remains thin and reactive
- Device-based auth over plugin storage
- No trust in client-side quota enforcement

---

## Roadmap

- Streaming generation output
- Smarter Figma node diffing
- Multi-session support
- Improved plugin-side error handling

---

## Security Notes

- All quota checks are server-side
- Plugin never stores credentials
- Authentication is always verified via backend
- DeviceId alone cannot grant access

---

## License

Private / Proprietary

---

## Maintainer

**Wuxma**  
Built with real-world SaaS constraints and Figma plugin best practices.
