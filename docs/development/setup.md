# Development Setup Guide

This guide will help you set up the development environment for the ECE496 Language Learning App using **TypeScript** and **Supabase**.

## Prerequisites

### Required Software
- **Node.js** (v18.0 or later) - [Download](https://nodejs.org/)
- **TypeScript** (v5.3 or later) - Install via npm: `npm install -g typescript`
- **Supabase CLI** - [Download](https://supabase.com/docs/guides/cli)
- **Docker** and **Docker Compose** - [Download](https://www.docker.com/)
- **Xcode** (for iOS development) - Available on Mac App Store

### Required Accounts
- **GitHub** account for version control
- **Supabase** account for backend-as-a-service
- **OpenAI API** account for GPT integration
- **Google Translate API** account (or alternative translation service)

## Quick Start

### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd ece496-project

# Install Supabase CLI
npm install -g supabase

# Run the automated setup script
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Supabase Setup

#### Local Development
```bash
# Start Supabase locally
supabase start

# This will start:
# - PostgreSQL database on port 54322
# - API Gateway on port 54321
# - Dashboard on port 54323
# - Inbucket for email testing on port 54324
# - Edge Functions runtime on port 54328
```

#### Cloud Setup
```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Push migrations to cloud
supabase db push

# Deploy Edge Functions
supabase functions deploy
```

### 3. Environment Configuration
Copy the example environment files and configure them:

```bash
# Backend environment
cp backend/.env.example backend/.env

# Supabase environment
cp .env.example .env
```

Edit the `.env` files with your configuration:

#### Backend Environment Variables (.env)
```env
# Supabase Configuration
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_PROJECT_ID=your_project_id

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Translation Service
GOOGLE_TRANSLATE_API_KEY=your_google_translate_key

# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

#### Generate Supabase Types
```bash
# Generate TypeScript types from your Supabase schema
cd backend
npm run generate-types
```

### 4. Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Generate Types
```bash
# Generate TypeScript types for your database schema
npm run generate-types
```

#### Frontend Dependencies (iOS)
```bash
cd frontend/LanguageLearningApp
# Dependencies will be managed through Xcode Swift Package Manager
# For TypeScript integration, install TypeScript types
npm install @supabase/supabase-js
```

## Development Workflow

### Starting Development Environment

#### Option 1: Using Supabase Locally (Recommended)
```bash
# Start Supabase locally (includes database, API, realtime, auth)
supabase start

# Start TypeScript backend server
cd backend
npm run dev

# Open iOS project in Xcode
open frontend/LanguageLearningApp/LanguageLearningApp.xcodeproj
```

#### Option 2: Using Supabase Cloud
```bash
# Start TypeScript backend server
cd backend
npm run dev

# Open iOS project in Xcode
open frontend/LanguageLearningApp/LanguageLearningApp.xcodeproj

# Use Supabase Cloud for database and authentication
```

### Running Tests

#### Backend Tests
```bash
cd backend
npm test                 # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run with coverage report
npm run lint            # Check code quality
npm run format          # Format code
```

#### Frontend Tests
```bash
cd frontend/LanguageLearningApp
# Run tests from Xcode Product menu
# Or use command line
xcodebuild test -project LanguageLearningApp.xcodeproj
```

### Database Management (Supabase)

#### Running Migrations
```bash
# Apply migrations locally
supabase db reset

# Apply migrations to cloud
supabase db push

# Create new migration
supabase migration new migration_name
```

#### Seeding Database
```bash
# Load seed data locally
supabase db reset

# Or manually run seed file
psql "postgresql://postgres:postgres@localhost:54322/postgres" -f supabase/seed.sql
```

#### Database Reset (Development)
```bash
# WARNING: This will delete all local data
supabase db reset

# Reset and reseed with fresh data
supabase db reset
```

### TypeScript Development

#### Type Generation
```bash
# Generate types from Supabase schema
npm run generate-types

# Watch for schema changes and regenerate
supabase gen types typescript --project-id $SUPABASE_PROJECT_ID --schema public > src/types/database.types.ts
```

#### Type Safety
- All database operations use generated types
- Input validation with Zod schemas
- API responses are fully typed
- Real-time subscriptions are type-safe

## Project Structure Overview

```
ece496-project/
├── frontend/           # iOS app (Swift/SwiftUI)
├── backend/            # TypeScript API server with Supabase
├── supabase/           # Supabase configuration & migrations
├── docs/              # Documentation
├── scripts/           # Development and deployment scripts
└── docker/            # Docker configuration
```

## Development Guidelines

### Development Guidelines

### Code Style

#### Backend (TypeScript)
- Use **ESLint** and **Prettier** for code formatting
- Follow **Airbnb TypeScript Style Guide**
- Use **async/await** for asynchronous operations
- Write **JSDoc** comments for functions and classes
- **Strict TypeScript** configuration with full type safety
- Use **Zod** for runtime type validation
- Follow **SOLID principles** and clean architecture

#### Frontend (Swift)
- Follow **Swift API Design Guidelines**
- Use **SwiftLint** for code quality
- Follow **MVVM architecture** pattern with TypeScript bindings
- Use **SwiftUI** for UI development
- Integrate **Supabase Swift SDK** for type-safe database operations

### Git Workflow

1. **Create feature branch**: `git checkout -b feature/object-recognition`
2. **Make changes and commit**: `git commit -m "Add object recognition feature"`
3. **Push and create PR**: `git push origin feature/object-recognition`
4. **Code review and merge** after approval

### API Development (TypeScript + Supabase)

- Use **Supabase client** for database operations
- Implement **Row Level Security** policies
- Use **Edge Functions** for serverless logic
- Add **input validation** with Zod schemas
- Document APIs with **OpenAPI/Swagger**
- Include **error handling** and logging
- Use **real-time subscriptions** for live updates

### Database Development (Supabase)

- Use **migrations** for schema changes (`supabase migration new`)
- Write **seed files** for test data (`supabase db reset`)
- Include **Row Level Security** policies
- Use **generated TypeScript types** for type safety
- Follow **naming conventions** (snake_case for SQL)
- Implement **real-time subscriptions** for live data

## Common Development Tasks

### Adding a New Language
1. Add language to `supabase/migrations/001_create_languages.sql`
2. Update frontend language selection
3. Add translation endpoints if needed
4. Test language switching functionality

### Adding a New Object Category
1. Insert category in `supabase/seed.sql`
2. Update Apple Vision object detection categories
3. Add corresponding SF Symbol icons
4. Test category recognition

### Adding a New API Endpoint
1. Create service in `backend/src/services/`
2. Add route in `backend/src/index.ts`
3. Update Zod validation schemas
4. Add TypeScript types
5. Test endpoint functionality

### Creating a Supabase Edge Function
```bash
# Create new Edge Function
supabase functions new function-name

# Deploy Edge Function
supabase functions deploy function-name

# Test locally
supabase functions serve
```

### Testing New Features
1. Write unit tests for business logic
2. Create integration tests for API endpoints
3. Test iOS app functionality on device/simulator
4. Verify Supabase real-time subscriptions
5. Test Edge Functions functionality

## Troubleshooting

### Common Issues

#### Supabase Connection Issues
```bash
# Check Supabase status
supabase status

# Reset local Supabase
supabase db reset

# Check logs
supabase logs
```

#### TypeScript Type Issues
```bash
# Regenerate types from Supabase
npm run generate-types

# Check for type errors
npm run lint

# Format code
npm run format
```

#### Backend API Issues
```bash
# Check backend logs
cd backend && npm run dev

# Test API endpoints
curl http://localhost:3000/health
```

#### iOS Build Issues
```bash
# Clean Xcode build
rm -rf ~/Library/Developer/Xcode/DerivedData

# Update Swift packages
cd frontend/LanguageLearningApp
swift package update
```

### Supabase-Specific Issues

#### Database Migrations
```bash
# Check migration status
supabase migration list

# Reset to specific migration
supabase db reset --to <migration_name>

# Create new migration
supabase migration new add_new_table
```

#### Edge Functions Issues
```bash
# Check function logs
supabase functions logs function-name

# Test function locally
supabase functions serve --no-verify-jwt
```

#### Real-time Subscriptions
```bash
# Test real-time connection
# Use Supabase dashboard to monitor real-time events
```

### Getting Help

1. **Check Supabase documentation** at [supabase.com/docs](https://supabase.com/docs)
2. **Review TypeScript documentation** for type safety
3. **Check error logs** in Supabase dashboard
4. **Search existing issues** in repository
5. **Ask team members** for complex problems
6. **Create detailed issue** with logs and steps to reproduce

## Next Steps

After successful setup:

1. **Read the Supabase documentation** for advanced features
2. **Review TypeScript best practices** for type safety
3. **Start with iOS development** - implement camera and object recognition
4. **Implement TypeScript backend** - word storage and translation services
5. **Integrate Edge Functions** for GPT example sentence generation
6. **Add real-time progress tracking** using Supabase subscriptions
7. **Implement testing** and deployment pipeline
8. **Set up monitoring** and analytics

Happy coding with TypeScript and Supabase! 🚀