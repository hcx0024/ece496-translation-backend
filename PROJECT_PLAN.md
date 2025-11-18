# ECE496 Language Learning App - Project Plan

## Project Overview
A language learning application that uses computer vision to recognize objects and helps users learn vocabulary through contextual examples.

## Core Functionality
1. **Object Recognition**: Frontend uses Apple Vision (or similar) to identify objects through phone camera
2. **Word Management**: Backend receives recognized words and stores them as learned vocabulary
3. **Translation Service**: Retrieves translations from database
4. **Contextual Learning**: Generates example sentences using GPT
5. **Progress Tracking**: Monitors user learning progress

## Technical Architecture

### Frontend (iOS/Mobile)
- **Technology**: TypeScript with Swift/SwiftUI for iOS (leverages Apple Vision Pro)
- **Key Features**:
  - Camera integration with live object detection
  - Real-time word recognition and display
  - Learning progress visualization
  - User-friendly interface for vocabulary review
  - Type-safe API communication with Supabase

### Backend
- **Technology**: TypeScript with Supabase
- **Key Services**:
  - Supabase Database for word storage and management
  - Supabase Auth for user authentication
  - Supabase Realtime for live progress updates
  - Translation service integration via Edge Functions
  - GPT integration for example sentences via Edge Functions
  - Database operations through Supabase client

### Database
- **Primary**: Supabase (PostgreSQL-based with real-time features)
- **Key Tables**:
  - Words (with multiple language support)
  - Translations
  - Example sentences
  - User progress and learning history
  - Object categories and associations
  - User profiles and preferences
  - Real-time subscriptions for progress updates

### External Integrations
- **Computer Vision**: Apple Vision Framework
- **AI/LLM**: OpenAI GPT API for sentence generation (via Supabase Edge Functions)
- **Translation**: Google Translate API or custom translation service (via Supabase Edge Functions)
- **Database & Auth**: Supabase for backend-as-a-service

## Development Approach
- **Frontend-First**: Develop object recognition and UI/UX
- **API Development**: Build backend services and database
- **Integration**: Connect all components
- **Testing**: Comprehensive testing across platforms
- **Deployment**: Mobile app distribution and backend hosting