# Repository Structure

## Root Directory
```
ece496-project/
├── README.md                           # Main project documentation
├── PROJECT_PLAN.md                     # Detailed project planning
├── .gitignore                          # Git ignore rules
├── .env.example                        # Environment variables template
├── docker-compose.yml                  # Development environment setup
├── SWEEP.md                           # Development commands and preferences
│
├── frontend/                          # Mobile Application (iOS)
│   ├── LanguageLearningApp/
│   │   ├── LanguageLearningApp.xcodeproj/
│   │   ├── LanguageLearningApp/
│   │   │   ├── App/
│   │   │   │   ├── AppDelegate.swift
│   │   │   │   └── SceneDelegate.swift
│   │   │   ├── Views/                 # SwiftUI Views
│   │   │   │   ├── Camera/
│   │   │   │   │   ├── CameraView.swift
│   │   │   │   │   ├── ObjectDetectionView.swift
│   │   │   │   │   └── RecognitionResultsView.swift
│   │   │   │   ├── Learning/
│   │   │   │   │   ├── VocabularyListView.swift
│   │   │   │   │   ├── WordCardView.swift
│   │   │   │   │   └── ProgressView.swift
│   │   │   │   └── Common/
│   │   │   ├── ViewModels/            # SwiftUI ViewModels
│   │   │   │   ├── CameraViewModel.swift
│   │   │   │   ├── VocabularyViewModel.swift
│   │   │   │   └── ProgressViewModel.swift
│   │   │   ├── Services/              # Network and API Services
│   │   │   │   ├── APIClient.swift
│   │   │   │   ├── ObjectRecognitionService.swift
│   │   │   │   └── UserProgressService.swift
│   │   │   ├── Models/                # Data Models
│   │   │   │   ├── Word.swift
│   │   │   │   ├── UserProgress.swift
│   │   │   │   └── APIResponse.swift
│   │   │   ├── Core/                  # Core Infrastructure
│   │   │   │   ├── Constants.swift
│   │   │   │   ├── Extensions.swift
│   │   │   │   └── Utilities.swift
│   │   │   └── Resources/             # Assets and Resources
│   │   │       ├── Assets.xcassets/
│   │   │       ├── Localizable.strings
│   │   │       └── Info.plist
│   │   ├── Tests/                     # Unit Tests
│   │   │   ├── Unit/
│   │   │   └── Integration/
│   │   └── README.md                  # Frontend-specific documentation
│
├── backend/                           # Supabase Edge Functions & TypeScript
│   ├── supabase/                      # Supabase configuration
│   │   ├── config.toml               # Supabase project configuration
│   │   ├── functions/                # Edge Functions
│   │   │   ├── generate-examples/    # GPT sentence generation
│   │   │   ├── translate-word/       # Translation service
│   │   │   └── process-recognition/  # Object recognition processing
│   │   ├── migrations/               # Database migrations
│   │   └── seed.sql                  # Database seed data
│   ├── src/                          # TypeScript source code
│   │   ├── types/                    # TypeScript type definitions
│   │   │   ├── database.types.ts     # Supabase generated types
│   │   │   ├── api.types.ts          # API response types
│   │   │   └── domain.types.ts       # Domain model types
│   │   ├── services/                 # Business logic services
│   │   │   ├── supabase.client.ts    # Supabase client configuration
│   │   │   ├── word.service.ts       # Word management logic
│   │   │   ├── translation.service.ts # Translation logic
│   │   │   ├── progress.service.ts   # User progress logic
│   │   │   └── ai.service.ts         # AI integration logic
│   │   ├── utils/                    # Utility functions
│   │   │   ├── validation.ts         # Input validation
│   │   │   ├── helpers.ts            # Helper functions
│   │   │   └── constants.ts          # Application constants
│   │   └── index.ts                  # Main application entry
│   ├── tests/                        # TypeScript test files
│   │   ├── unit/
│   │   ├── integration/
│   │   └── fixtures/
│   ├── package.json                  # Node.js dependencies
│   ├── tsconfig.json                # TypeScript configuration
│   ├── .env.example                 # Environment variables template
│   └── README.md                    # Backend-specific documentation
│
├── supabase/                         # Supabase Configuration & Migrations
│   ├── config.toml                    # Supabase project settings
│   ├── migrations/                    # Database migrations
│   │   ├── 001_create_languages.sql
│   │   ├── 002_create_object_categories.sql
│   │   ├── 003_create_words.sql
│   │   ├── 004_create_translations.sql
│   │   ├── 005_create_example_sentences.sql
│   │   ├── 006_create_user_profiles.sql
│   │   ├── 007_create_user_progress.sql
│   │   ├── 008_create_learning_sessions.sql
│   │   └── 009_create_recognition_events.sql
│   ├── seed.sql                       # Initial data seed
│   ├── functions/                     # Edge Functions
│   │   ├── generate-examples/
│   │   │   └── index.ts              # GPT sentence generation
│   │   ├── translate-word/
│   │   │   └── index.ts              # Translation service
│   │   └── process-recognition/
│   │       └── index.ts              # Recognition processing
│   └── README.md                      # Database documentation
│
├── docs/                            # Project Documentation
│   ├── api/                         # API Documentation
│   │   ├── openapi.yaml
│   │   └── endpoints/
│   ├── architecture/                # System architecture docs
│   │   ├── frontend.md
│   │   ├── backend.md
│   │   └── database.md
│   ├── development/                 # Development guidelines
│   │   ├── setup.md
│   │   ├── workflow.md
│   │   └── coding-standards.md
│   └── deployment/                  # Deployment documentation
│       ├── infrastructure.md
│       ├── docker.md
│       └── monitoring.md
│
├── scripts/                         # Development and deployment scripts
│   ├── setup.sh                     # Initial project setup
│   ├── start-dev.sh                 # Start development environment
│   ├── run-tests.sh                 # Run all tests
│   ├── build.sh                     # Build scripts
│   └── deploy.sh                    # Deployment automation
│
├── .github/                         # GitHub configuration
│   ├── workflows/                   # CI/CD workflows
│   │   ├── ci.yml
│   │   ├── test.yml
│   │   └── deploy.yml
│   └── pull_request_template.md
│
└── docker/                          # Docker configuration
    ├── Dockerfile.frontend
    ├── Dockerfile.backend
    ├── docker-compose.dev.yml
    └── docker-compose.prod.yml
```

## Key Features by Directory

### Frontend (LanguageLearningApp/)
- **Object Recognition**: Camera integration with Apple Vision
- **SwiftUI Views**: Modern declarative UI components with TypeScript integration
- **MVVM Architecture**: Clean separation of concerns with type-safe bindings
- **Supabase Client**: Real-time database and authentication
- **API Integration**: Type-safe network services for Supabase communication
- **Local Storage**: Core Data for offline functionality

### Backend (Supabase/TypeScript)
- **Supabase Edge Functions**: Server-side TypeScript functions
- **Real-time Database**: PostgreSQL with live subscriptions
- **Authentication**: Built-in user management and security
- **Type Safety**: Full TypeScript support with generated types
- **External Integrations**: GPT and translation services via Edge Functions
- **Service Layer**: Clean business logic separation in TypeScript

### Supabase Configuration
- **Database Migrations**: Version-controlled schema changes
- **Row Level Security**: Built-in data protection
- **Real-time Subscriptions**: Live data updates
- **Edge Functions**: Serverless TypeScript functions
- **Storage**: File and image management

## Development Workflow

1. **Setup**: Use `scripts/setup.sh` for initial configuration
2. **Development**: Use `scripts/start-dev.sh` to run local environment
3. **Testing**: Use `scripts/run-tests.sh` to run comprehensive tests
4. **Deployment**: Use `scripts/deploy.sh` for production deployment

## Technology Stack

- **Frontend**: Swift, SwiftUI, TypeScript for iOS
- **Backend**: TypeScript with Supabase (Edge Functions + Database)
- **Database**: Supabase PostgreSQL with real-time capabilities
- **Authentication**: Supabase Auth with JWT tokens
- **External APIs**: OpenAI GPT, Google Translate (via Edge Functions)
- **Real-time**: Supabase Realtime for live updates
- **Type Safety**: TypeScript throughout the stack
- **Development**: Vite, ESLint, Prettier, Jest for testing