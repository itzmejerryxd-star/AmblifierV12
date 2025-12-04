# Audio Boost Pro - Discord Input Amplifier

## Overview

Audio Boost Pro is a web-based audio control panel designed for boosting Discord input audio levels with precision controls and real-time visualization. The application provides professional-grade audio manipulation with boost levels up to 1000dB, real-time waveform visualization, and device management capabilities. It's built as a full-stack TypeScript application using React for the frontend and Express for the backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**UI Component Library**: Shadcn/ui with Radix UI primitives for accessible, customizable components. The design system follows a Material Design Dark Theme approach inspired by professional audio software (DAWs, mixing boards), emphasizing precision over decoration.

**Styling**: Tailwind CSS with a custom dark theme configuration. The color system uses HSL values with CSS custom properties for theming. Typography uses Inter for UI elements and JetBrains Mono for numeric/technical displays.

**State Management**: 
- React hooks for local component state
- TanStack Query (React Query) for server state management and data fetching
- Custom `useAudioContext` hook manages all audio-related state and Web Audio API interactions

**Routing**: Wouter for lightweight client-side routing (currently single-page with home and 404 routes).

**Key Frontend Components**:
- **Audio Processing**: Custom hook (`useAudioContext`) that manages Web Audio API nodes (AudioContext, AnalyserNode, GainNode, MediaStreamAudioSourceNode)
- **Device Management**: Audio device enumeration and selection
- **Real-time Visualization**: Canvas-based waveform and frequency spectrum visualizers
- **Control Interface**: Slider controls for boost levels (0-1000dB), device selectors, mute/unmute, connection management

### Backend Architecture

**Server Framework**: Express.js with TypeScript, served via Node.js HTTP server.

**API Design**: RESTful API endpoints for audio settings persistence:
- `GET /api/health` - Health check endpoint
- `POST /api/audio-settings` - Save new audio settings
- `GET /api/audio-settings/:id` - Retrieve settings by ID
- `PATCH /api/audio-settings/:id` - Update existing settings

**Data Validation**: Zod schemas for runtime type checking and validation of audio settings and device configurations.

**Storage Layer**: Abstract storage interface (`IStorage`) with in-memory implementation (`MemStorage`). The architecture supports future database integration through the interface pattern.

**Build System**: 
- Client: Vite bundles the React application
- Server: esbuild bundles the Express server with selective dependency bundling (allowlist approach for faster cold starts)
- Custom build script coordinates both builds and outputs to `dist/` directory

### Data Storage Solutions

**Current Implementation**: In-memory storage using JavaScript Maps for:
- User data (if authentication is implemented)
- Audio settings (boost levels, device selections, mute states)

**Database Schema Design**: Prepared for PostgreSQL integration via Drizzle ORM:
- Configuration files ready (`drizzle.config.ts`)
- Schema definitions in `shared/schema.ts` using Zod for validation
- Migration directory structure established
- Connection string expected via `DATABASE_URL` environment variable

**Data Models**:
- `AudioSettings`: Stores input/output device IDs, boost level, enabled/muted states
- `User`: Basic user model with username/password (prepared for authentication)

### Authentication and Authorization

**Current State**: User schema defined but authentication not yet implemented.

**Prepared Infrastructure**: 
- User model with ID, username, password fields
- Storage interface includes user CRUD operations
- Session management dependencies installed (express-session, connect-pg-simple)

### External Dependencies

**Core Runtime Dependencies**:
- `@neondatabase/serverless` - Neon Database serverless driver for PostgreSQL
- `drizzle-orm` - TypeScript ORM for database operations
- `express` - Web server framework
- `react` / `react-dom` - Frontend UI framework
- `@tanstack/react-query` - Server state management
- `zod` - Runtime type validation

**UI Component Libraries**:
- `@radix-ui/*` - Primitive components (accordion, dialog, dropdown, slider, etc.)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Component variant management
- `cmdk` - Command palette component
- `lucide-react` - Icon library

**Audio & Visualization**:
- Web Audio API (browser native) - Audio processing, analysis, and routing
- Canvas API (browser native) - Waveform and frequency visualization

**Development Tools**:
- `vite` - Frontend build tool and dev server
- `esbuild` - Server bundler
- `tsx` - TypeScript execution for development
- `@replit/vite-plugin-*` - Replit-specific development plugins

**Build & Deployment**:
- PostgreSQL database (via Neon) - Expected but not yet connected
- Environment variable: `DATABASE_URL` required for database connection
- Static file serving from `dist/public` in production

**Design System Resources**:
- Google Fonts: Inter (primary UI), JetBrains Mono (monospace/technical)
- Custom CSS variables for theming and elevation effects
- Dark theme enforced via HTML class attribute